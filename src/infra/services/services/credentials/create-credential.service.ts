import { EncryptedData, EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class CreateCredentialService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		title: string,
		username: string,
		password: string,
		url?: string,
	) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("User not found");
		}
		const applicationMasterKey = this.encryptionService.getApplicationMasterKey();
		const [userKeyIv, userKeyContent] = user.encryptedDataKey.split(":");
		const userDataKey = Buffer.from(
			this.encryptionService.decrypt(
				{ iv: userKeyIv, content: userKeyContent },
				applicationMasterKey,
			),
			"hex",
		);
		const encryptedTitle = this.encryptionService.encrypt(title, userDataKey);
		const encryptedUsername = this.encryptionService.encrypt(
			username,
			userDataKey,
		);
		const encryptedPassword = this.encryptionService.encrypt(
			password,
			userDataKey,
		);
		let encryptedUrl: EncryptedData | null = null;
		if (url) {
			encryptedUrl = this.encryptionService.encrypt(url, userDataKey);
		}
		await this.prismaService.credential.create({
			data: {
				userId,
				encryptedTitleIv: encryptedTitle.iv,
				encryptedTitleContent: encryptedTitle.content,
				encryptedUsernameIv: encryptedUsername.iv,
				encryptedUsernameContent: encryptedUsername.content,
				encryptedPasswordIv: encryptedPassword.iv,
				encryptedPasswordContent: encryptedPassword.content,
				encryptedUrlIv: encryptedUrl?.iv,
				encryptedUrlContent: encryptedUrl?.content,
			},
		});
	}
}
