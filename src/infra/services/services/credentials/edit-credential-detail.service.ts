import {
	EncryptedData,
	EncryptionService,
} from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EditedPlainCrendential } from "@/infra/http/controllers/credentials/edit-credentail-detail.controller";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class EditCredentialDetailService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		credentailId: string,
		data: EditedPlainCrendential,
	): Promise<void> {
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
			throw new BadRequestException("Credential not existed");
		}
		const currentTitle = this.encryptionService.decrypt(
			{
				iv: credential.encryptedTitleIv,
				content: credential.encryptedTitleContent,
			},
			userDataKey,
		);
		const currentUsername = this.encryptionService.decrypt(
			{
				iv: credential.encryptedUsernameIv,
				content: credential.encryptedUsernameContent,
			},
			userDataKey,
		);
		const currentPassword = this.encryptionService.decrypt(
			{
				iv: credential.encryptedPasswordIv,
				content: credential.encryptedPasswordContent,
			},
			userDataKey,
		);
		const currentUrl =
			credential?.encryptedUrlIv && credential.encryptedUrlContent
				? this.encryptionService.decrypt(
						{
							iv: credential.encryptedUrlIv,
							content: credential.encryptedUrlContent,
						},
						userDataKey,
					)
				: undefined;
		const newTitle = data.title ?? currentTitle;
		const newUsername = data.username ?? currentUsername;
		const newPassword = data.password ?? currentPassword;
		const newUrl = data.url ?? currentUrl;
		const newCategoryId = data.categoryId ?? credential.categoryId;
		const encryptedTitle = this.encryptionService.encrypt(
			newTitle,
			userDataKey,
		);
		const encryptedUsername = this.encryptionService.encrypt(
			newUsername,
			userDataKey,
		);
		const encryptedPassword = this.encryptionService.encrypt(
			newPassword,
			userDataKey,
		);
		let encryptedUrl: null | EncryptedData = null;
		if (newUrl) {
			encryptedUrl = this.encryptionService.encrypt(newUrl, userDataKey);
		}
		await this.prismaService.credential.update({
			where: { id: credentailId, userId: userId },
			data: {
				encryptedTitleIv: encryptedTitle.iv,
				encryptedTitleContent: encryptedTitle.content,
				encryptedUsernameIv: encryptedUsername.iv,
				encryptedUsernameContent: encryptedUsername.content,
				encryptedPasswordIv: encryptedPassword.iv,
				encryptedPasswordContent: encryptedPassword.content,
				encryptedUrlIv: encryptedUrl?.iv,
				encryptedUrlContent: encryptedUrl?.content,
				categoryId: newCategoryId,
			},
		});
	}
}
