import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { randomBytes } from "crypto";

@Injectable()
export class CreateShareService {
	constructor(
		private prisma: PrismaService,
		private encryptionService: EncryptionService,
		private bcrypt: BcryptHasher,
	) {}

	async execute(
		userId: string,
		dto: {
			credentialId: string;
			masterPassword: string;
			expiresIn: "1h" | "24h" | "7d";
			deleteOnRead: boolean;
		},
	): Promise<{ shareId: string; shareKey: string }> {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) throw new BadRequestException("Usuário não encontrado");

		const isMasterPasswordValid = await this.bcrypt.compare(
			dto.masterPassword,
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

		const credential = await this.prisma.credential.findFirst({
			where: { id: dto.credentialId, userId },
		});
		if (!credential) {
			throw new BadRequestException("Credencial não encontrada");
		}

		const decryptedCredential = this.encryptionService.getDecryptedCredential(
			{
				id: credential.id,
				encryptedTitleIv: credential.encryptedTitleIv,
				encryptedTitleContent: credential.encryptedTitleContent,
				encryptedUsernameIv: credential.encryptedUsernameIv,
				encryptedUsernameContent: credential.encryptedUsernameContent,
				encryptedPasswordIv: credential.encryptedPasswordIv,
				encrpytedPasswordContent: credential.encryptedPasswordContent,
				encryptedUrlIv: credential.encryptedUrlIv,
				encryptedUrlContent: credential.encryptedUrlContent,
			},
			userDataKey,
		);

		const shareKey = randomBytes(32);

		const dataToEncrypt = JSON.stringify(decryptedCredential);

		const { iv, content } = this.encryptionService.encrypt(
			dataToEncrypt,
			shareKey,
		);
		const encryptedBlob = JSON.stringify({ iv, content });

		const expiresAt = this.calculateExpiration(dto.expiresIn);

		const sharedItem = await this.prisma.sharedItem.create({
			data: {
				title: decryptedCredential.title,
				userId,
				encryptedBlob,
				expiresAt,
				deleteOnRead: dto.deleteOnRead,
				hash: shareKey.toString("hex"),
			},
		});

		return {
			shareId: sharedItem.id,
			shareKey: shareKey.toString("hex"),
		};
	}

	private calculateExpiration(expiresIn: "1h" | "24h" | "7d"): Date {
		const now = new Date();
		switch (expiresIn) {
			case "1h":
				return new Date(now.getTime() + 60 * 60 * 1000);
			case "24h":
				return new Date(now.getTime() + 24 * 60 * 60 * 1000);
			case "7d":
				return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
			default:
				throw new InternalServerErrorException("Expiração inválida");
		}
	}
}
