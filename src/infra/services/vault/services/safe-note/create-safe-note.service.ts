import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSafeNoteService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		title: string,
		content: string,
    isEmergency: boolean,
		categoryId?: string,
	) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new Error("Usuário não encontrado");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const encryptedTitle = this.encryptionService.encrypt(title, userDataKey);
		const encryptedContent = this.encryptionService.encrypt(
			content,
			userDataKey,
		);
		await this.prismaService.safeNote.create({
			data: {
				userId,
				encryptedTitleIv: encryptedTitle.iv,
				encryptedTitleContent: encryptedTitle.content,
				encryptedNoteIv: encryptedContent.iv,
				encryptedNoteContent: encryptedContent.content,
				categoryId: categoryId || null,
        isEmergency
			},
		});
	}
}
