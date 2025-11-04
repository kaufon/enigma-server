import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

@Injectable()
export class RevokeShareService {
	constructor(private prisma: PrismaService) {}

	async execute(userId: string, shareId: string): Promise<void> {
		const item = await this.prisma.sharedItem.findUnique({
			where: { id: shareId },
		});

		if (!item) {
			throw new NotFoundException("Link não encontrado.");
		}

		if (item.userId !== userId) {
			throw new ForbiddenException(
				"Você não tem permissão para revogar este link.",
			);
		}

		await this.prisma.sharedItem.delete({
			where: { id: shareId },
		});
	}
}
