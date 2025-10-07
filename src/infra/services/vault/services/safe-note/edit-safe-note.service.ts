import {
	EncryptionService,
} from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EditedPlainSafeNote } from "@/infra/http/vault/controllers/safe-note/edit-safe-note.controller";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class EditSafeNoteService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		safeNoteId: string,
		data: EditedPlainSafeNote,
	): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("Usuario não encontrado");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const safeNote = await this.prismaService.safeNote.findUnique({
			where: { userId, id: safeNoteId },
		});
		if (!safeNote) {
			throw new BadRequestException("Credencial não encontrada");
		}
		const currentTitle = this.encryptionService.decrypt(
			{
				iv: safeNote.encryptedTitleIv,
				content: safeNote.encryptedTitleContent,
			},
			userDataKey,
		);
		const currentContent = this.encryptionService.decrypt(
			{
				iv: safeNote.encryptedNoteIv,
				content: safeNote.encryptedNoteContent,
			},
			userDataKey,
		);
		const newTitle = data.title ?? currentTitle;
		const newContent = data.content ?? currentContent;
		let newCategoryId: string | null = safeNote.categoryId;
		if (data.categoryId) {
			const category = await this.prismaService.category.findUnique({
				where: { id: data.categoryId, userId: userId },
			});
			if (!category) {
				throw new BadRequestException("Categoria não encontrada");
			}
			newCategoryId = data.categoryId;
		} else if (data.categoryId === null) {
			newCategoryId = null;
		}
		const encryptedTitle = this.encryptionService.encrypt(
			newTitle,
			userDataKey,
		);
		const encryptedContent = this.encryptionService.encrypt(
			newContent,
			userDataKey,
		);
		await this.prismaService.safeNote.update({
			where: { id: safeNoteId, userId: userId },
			data: {
				encryptedTitleIv: encryptedTitle.iv,
				encryptedTitleContent: encryptedTitle.content,
				encryptedNoteIv: encryptedContent.iv,
				encryptedNoteContent: encryptedContent.content,
				categoryId: newCategoryId,
			},
		});
	}
}
