import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import csv = require("csv-parser");
import { Readable } from "stream";
import { DecryptedCredential } from "@/infra/services/vault/services/credentials/list-credentials.service";

interface ImportItem {
	category?: string;
	title: string;
	username?: string;
	password?: string;
	url?: string;
	note?: string;
	isEmergency?: boolean;
}
export type EncryptedCredential = {};

@Injectable()
export class ImportVaultService {
	constructor(
		private prisma: PrismaService,
		private encryptionService: EncryptionService,
		private bcrypt: BcryptHasher,
	) {}

	async decryptPayload(
		payload: {
			id: string;
			encryptedTitleIv: string;
			encryptedTitleContent: string;
			encryptedUsernameIv: string;
			encryptedUsernameContent: string;
			encryptedUrlIv: string | null;
			encryptedUrlContent: string | null;
			encryptedPasswordIv?: string;
			encrpytedPasswordContent?: string;
			categoryId?: string;
		},
		userDataKey: Buffer,
	): Promise<DecryptedCredential> {
		return this.encryptionService.getDecryptedCredential(payload, userDataKey);
	}

	async execute(
		userId: string,
		dto: { password: string; format: "json" | "csv" },
		fileContent: string,
	) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new BadRequestException("Usuário não encontrado");
		}
		const isMasterPasswordValid = await this.bcrypt.compare(
			dto.password,
			user.masterKey,
		);
		if (!isMasterPasswordValid) {
			throw new UnauthorizedException("Senha mestra inválida");
		}

		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);

		let credentialsToImport: ImportItem[] = [];
		let safeNotesToImport: ImportItem[] = [];

		try {
			if (dto.format === "csv") {
				const parsedCsv = await this.parseCsv(fileContent);
				credentialsToImport = parsedCsv.filter((item) => item.password);
				safeNotesToImport = parsedCsv.filter(
					(item) => item.note && !item.password,
				);
			} else {
				const parsedData = JSON.parse(fileContent);
				credentialsToImport = parsedData.credentials || [];
				safeNotesToImport = parsedData.safeNotes || [];
			}
		} catch (error) {
			throw new BadRequestException(
				"Falha ao analisar o arquivo. Formato inválido.",
			);
		}

		try {
			const result = await this.prisma.$transaction(async (tx) => {
				const categoryCache = new Map<string, string>();
				let credCount = 0;
				let noteCount = 0;

				const getCategoryId = async (name?: string): Promise<string | null> => {
					if (!name) return null;
					if (categoryCache.has(name)) return categoryCache.get(name)!;

					let category = await tx.category.findFirst({
						where: { userId, name },
					});
					if (!category) {
						category = await tx.category.create({ data: { userId, name } });
					}
					categoryCache.set(name, category.id);
					return category.id;
				};

				for (const item of credentialsToImport) {
					const categoryId = await getCategoryId(item.category);
					const encTitle = this.encryptionService.encrypt(
						item.title,
						userDataKey,
					);
					const encUsername = this.encryptionService.encrypt(
						item.username || "",
						userDataKey,
					);
					const encPassword = this.encryptionService.encrypt(
						item.password || "",
						userDataKey,
					);
					const encUrl = item.url
						? this.encryptionService.encrypt(item.url, userDataKey)
						: null;

					await tx.credential.create({
						data: {
							userId,
							categoryId,
							encryptedTitleIv: encTitle.iv,
							encryptedTitleContent: encTitle.content,
							encryptedUsernameIv: encUsername.iv,
							encryptedUsernameContent: encUsername.content,
							encryptedPasswordIv: encPassword.iv,
							encryptedPasswordContent: encPassword.content,
							encryptedUrlIv: encUrl?.iv,
							encryptedUrlContent: encUrl?.content,
							isEmergency: item.isEmergency || false,
						},
					});
					credCount++;
				}

				for (const item of safeNotesToImport) {
					const categoryId = await getCategoryId(item.category);
					const encTitle = this.encryptionService.encrypt(
						item.title,
						userDataKey,
					);
					const encNote = this.encryptionService.encrypt(
						item.note || "",
						userDataKey,
					);

					await tx.safeNote.create({
						data: {
							userId,
							categoryId,
							encryptedTitleIv: encTitle.iv,
							encryptedTitleContent: encTitle.content,
							encryptedNoteIv: encNote.iv,
							encryptedNoteContent: encNote.content,
							isEmergency: item.isEmergency || false,
						},
					});
					noteCount++;
				}

				return { credCount, noteCount };
			});

			return {
				message: "Importação concluída com sucesso.",
				importedCredentials: result.credCount,
				importedSafeNotes: result.noteCount,
			};
		} catch (error) {
			console.error("Falha na transação de importação:", error);
			throw new InternalServerErrorException("Erro ao salvar dados no banco.");
		}
	}

	private parseCsv(fileContent: string): Promise<ImportItem[]> {
		return new Promise((resolve, reject) => {
			const results: ImportItem[] = [];
			const stream = Readable.from(fileContent);

			stream
				.pipe(csv())
				.on("data", (data) => {
					if (data.isEmergency) {
						data.isEmergency = data.isEmergency.toLowerCase() === "true";
					}
					results.push(data);
				})
				.on("end", () => {
					resolve(results);
				})
				.on("error", (error) => {
					reject(error);
				});
		});
	}
}
