import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export type DecryptedSafeNote = {
	id: string;
	title: string;
	content?: string;
	categoryId?: string;
};
export type ListSafeNotesParams = {
	categoryId?: string;
	name?: string;
};

@Injectable()
export class ListSafeNotesService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		params: ListSafeNotesParams,
	): Promise<DecryptedSafeNote[]> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("Usuário não encontrado");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const whereClause: Prisma.SafeNoteWhereInput = { userId };
		if (params.categoryId) {
			whereClause.categoryId = params.categoryId;
		}
		const safeNotes = await this.prismaService.safeNote.findMany({
			where: whereClause,
			orderBy: { createdAt: "desc" },
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
		return decryptedSafeNotes;
	}
}
