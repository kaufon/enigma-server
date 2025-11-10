import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export type ActiveShareDetails = {
	id: string;
	createdAt: Date;
	expiresAt: Date;
	accessCount: number;
	deleteOnRead: boolean;
};

@Injectable()
export class ListMySharesService {
	constructor(private prisma: PrismaService) {}

	async execute(userId: string): Promise<ActiveShareDetails[]> {
		const activeShares = await this.prisma.sharedItem.findMany({
			where: {
				userId: userId,
				expiresAt: {
					gt: new Date(),
				},
			},
			select: {
				id: true,
				title: true,
				createdAt: true,
				expiresAt: true,
				accessCount: true,
				deleteOnRead: true,
        hash: true
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return activeShares;
	}
}
