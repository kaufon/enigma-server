import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteSafeNoteService {
	constructor(private prismaService: PrismaService) {}
	async execute(userId: string, safeNoteId: string): Promise<void> {
		const credential = await this.prismaService.safeNote.findUnique({
			where: { userId, id: safeNoteId },
		});
		if (!credential) {
			throw new BadRequestException("Nota segura não encontrada");
		}
		if (credential.userId !== userId) {
			throw new BadRequestException(
				"Sem permissão para deletar essa credencial",
			);
		}
		await this.prismaService.safeNote.delete({
			where: { id: safeNoteId },
		});
	}
}
