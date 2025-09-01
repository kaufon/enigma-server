import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

export type DecryptedCredential = {
	id: string;
	title: string;
	username: string;
	url?: string;
	password?: string;
};

@Injectable()
export class GetCredentialDetailService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		credentailId: string,
	): Promise<DecryptedCredential> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("User not found");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const credential = await this.prismaService.credential.findUnique({
			where: { userId, id: credentailId },
		});
		if (!credential) {
			throw new BadRequestException("Credential not found");
		}
		const decryptedCredential = this.encryptionService.getDecryptedCredential(
			{
				id: credential.id,
				categoryId: credential.categoryId ?? undefined,
				encryptedTitleIv: credential.encryptedTitleIv,
				encryptedTitleContent: credential.encryptedTitleContent,
				encryptedUsernameIv: credential.encryptedUsernameIv,
				encryptedUsernameContent: credential.encryptedUsernameContent,
				encryptedUrlIv: credential.encryptedUrlIv,
				encryptedUrlContent: credential.encryptedUrlContent,
				encryptedPasswordIv: credential.encryptedPasswordIv,
				encrpytedPasswordContent: credential.encryptedPasswordContent,
			},
			userDataKey,
		);
		return decryptedCredential;
	}
}
