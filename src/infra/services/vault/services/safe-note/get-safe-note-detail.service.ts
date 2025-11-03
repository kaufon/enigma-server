import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

export type DecryptedSafeNote = {
	id: string;
	title: string;
	content?: string;
	categoryId?: string;
};

@Injectable()
export class GetSafeNoteDetailService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		safeNoteId: string,
	): Promise<DecryptedSafeNote> {
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
			throw new BadRequestException("Note segurs não encontrada");
		}
		const decryptedSafeNote = this.encryptionService.getDecryptedSafeNote(
			{
				id: safeNote.id,
				categoryId: safeNote.categoryId ?? undefined,
				encryptedTitleIv: safeNote.encryptedTitleIv,
				encryptedTitleContent: safeNote.encryptedTitleContent,
				encryptedSafeNoteIv: safeNote.encryptedNoteIv,
				encryptedSafeNoteContent: safeNote.encryptedNoteContent,
			},
			userDataKey,
		);
		return decryptedSafeNote;
	}
}
