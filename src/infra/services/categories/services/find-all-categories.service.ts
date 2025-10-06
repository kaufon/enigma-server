import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export type Category = {
	id: string;
	name: string;
	credentialsCount: number;
};

@Injectable()
export class FindAllCategoriesService {
	constructor(private readonly prismaService: PrismaService) {}
	async execute(userId: string): Promise<Category[]> {
		const prismaCategories = await this.prismaService.category.findMany({
			omit: { userId: true, createdAt: true, updatedAt: true },
			where: { userId },
			include: { _count: { select: { credentials: true } } },
		});
		return prismaCategories.map((category) => ({
			id: category.id,
			name: category.name,
			credentialsCount: category._count.credentials,
		}));
	}
}
