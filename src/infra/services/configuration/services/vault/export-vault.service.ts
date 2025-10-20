import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CategoryDetails } from "@/infra/services/categories/services/get-category-details.service";
import { DecryptedCredential } from "@/infra/services/vault/services/credentials/list-credentials.service";
import { DecryptedSafeNote } from "@/infra/services/vault/services/safe-note/list-safe-notes.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

export type DecryptedVault = {
	categories: CategoryDetails[];
	credentials: DecryptedCredential[];
	safeNotes: DecryptedSafeNote[];
};
@Injectable()
export class ExportVaultService {
	constructor(
		private prisma: PrismaService,
		private encryptionService: EncryptionService,
		private bcrypt: BcryptHasher,
	) {}
	async execute(
		userId: string,
		password: string,
		format: "json" | "csv" | "json_protected",
		exportPassword?: string,
	) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("Usuário não encontrado");
		}
		const isPasswordValid = await this.bcrypt.compare(password, user.masterKey);
		if (!isPasswordValid) {
			throw new BadRequestException("Senha inválida");
		}
		const decryptedVault = await this.getDecryptedVault(user);
		switch (format) {
			case "json":
				return this.formatAsJson(decryptedVault);
			case "json_protected":
				if (!exportPassword) {
					throw new BadRequestException(
						"Export password is required for protected JSON format",
					);
				}
				throw new BadRequestException("Formato de exportação inválido");
			case "csv":
				return this.formatAsCsv(decryptedVault);
			default:
				throw new BadRequestException("Formato de exportação inválido");
		}
	}
	private async getDecryptedVault(user: User): Promise<DecryptedVault> {
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);

		const categories = await this.prisma.category.findMany({
			where: { userId: user.id },
		});
		const credentials = await this.prisma.credential.findMany({
			where: { userId: user.id },
		});
		const safeNotes = await this.prisma.safeNote.findMany({
			where: { userId: user.id },
		});
		const decryptedCredentials = credentials.map((credential) => {
			return this.encryptionService.getDecryptedCredential(
				{
					id: credential.id,
					encryptedTitleIv: credential.encryptedTitleIv,
					encryptedTitleContent: credential.encryptedTitleContent,
					encryptedUsernameIv: credential.encryptedUsernameIv,
					encryptedUsernameContent: credential.encryptedUsernameContent,
					encryptedUrlIv: credential.encryptedUrlIv,
					encryptedUrlContent: credential.encryptedUrlContent,
					categoryId: credential.categoryId ?? undefined,
				},
				userDataKey,
			);
		});
		const decryptedSafeNotes = safeNotes.map((credential) => {
			return this.encryptionService.getDecryptedSafeNote(
				{
					id: credential.id,
					encryptedTitleIv: credential.encryptedTitleIv,
					encryptedTitleContent: credential.encryptedTitleContent,
					categoryId: credential.categoryId ?? undefined,
				},
				userDataKey,
			);
		});
		const categoryDetails: CategoryDetails[] = categories.map((category) => {
			return {
				id: category.id,
				name: category.name,
				credentials: decryptedCredentials
					.filter((credential) => credential.categoryId === category.id)
					.map((credential) => ({
						id: credential.id,
						title: credential.title,
					})),
			};
		});
		return {
			categories: categoryDetails,
			credentials: decryptedCredentials,
			safeNotes: decryptedSafeNotes,
		};
	}
	private formatAsJson(data: DecryptedVault) {
		const jsonData = JSON.stringify(data, null, 2);
		return {
			data: jsonData,
			mime: "application/octet-stream",
			filename: "enigma_export.json",
		};
	}
	private formatAsProtectedJson(data: DecryptedVault, exportPassword: string) {
		const jsonData = JSON.stringify(data, null, 2);
		// const encryptedData = this.encryptionService.encryptWithPassword(
		// 	jsonData,
		// 	exportPassword,
		// );
		// return {
		// 	data: encryptedData,
		// 	mime: "application/octet-stream",
		// 	filename: "enigma_export_protected.json",
		// };
	}
	private escapeCsv(value: string | boolean | null | undefined): string {
		if (value === null || value === undefined) return "";
		const str = String(value);
		if (str.includes(",") || str.includes('"') || str.includes("\n")) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	}
	private formatAsCsv(data: DecryptedVault) {
		const categoryMap = new Map(data.categories.map((c) => [c.id, c.name]));

		const headers = "category,title,username,password,url,note\n";

		const credentialRows = data.credentials
			.map((c) =>
				[
					categoryMap.get(c.categoryId || "") || "",
					c.title,
					c.username,
					c.password,
					c.url || "",
					"",
				]
					.map(this.escapeCsv)
					.join(","),
			)
			.join("\n");

		const safeNoteRows = data.safeNotes
			.map((sn) =>
				[
					categoryMap.get(sn.categoryId || "") || "",
					sn.title,
					"",
					"",
					"",
					sn.content,
				]
					.map(this.escapeCsv)
					.join(","),
			)
			.join("\n");

		const csvData = headers + credentialRows + "\n" + safeNoteRows;

		return {
			data: csvData,
			mime: "text/csv",
			filename: "enigma_export.csv",
		};
	}
}
