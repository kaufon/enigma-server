import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export type Category = {
	name: string;
};

@Injectable()
export class FindAllCategoriesService {
	constructor(private readonly prismaService: PrismaService) {}
	async execute(userId: string): Promise<Category[]> {
		return await this.prismaService.category.findMany({
			omit: { userId: true, createdAt: true, updatedAt: true },
			where: { userId },
		});
	}
}
