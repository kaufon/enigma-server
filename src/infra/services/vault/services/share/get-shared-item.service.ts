import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class GetSharedItemService {
	constructor(private prisma: PrismaService) {}

	async execute(
		shareId: string,
		userId?: string,
	): Promise<{ encryptedBlob: { iv: string; content: string } }> {
    console.log("GetSharedItemService.execute called with shareId:", shareId, "and userId:", userId);
		let currentUser: User | null = null;
		if (userId) {
			currentUser = await this.prisma.user.findUnique({
				where: { id: userId },
			});
			if (!currentUser) {
				currentUser = null;
			}
		}
		const result = await this.prisma.$transaction(async (tx) => {
			const item = await tx.sharedItem.findUnique({
				where: { id: shareId },
			});

			if (!item) {
				throw new NotFoundException("Link não encontrado.");
			}

			if (new Date() > item.expiresAt) {
				await tx.sharedItem.delete({ where: { id: shareId } });
				throw new NotFoundException("Link expirado.");
			}

			if (item.deleteOnRead && item.userId !== currentUser?.id) {
				await tx.sharedItem.delete({ where: { id: shareId } });
				return JSON.parse(item.encryptedBlob);
			}
			await tx.sharedItem.update({
				where: { id: shareId },
				data: { accessCount: { increment: 1 } },
			});
			return JSON.parse(item.encryptedBlob);
		});

		return result;
	}
}
