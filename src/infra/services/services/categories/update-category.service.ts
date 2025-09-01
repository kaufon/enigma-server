import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateCategoryService {
	constructor(private readonly prismaService: PrismaService) {}
	async execute(
		name: string,
		categoryId: string,
		userId: string,
	): Promise<void> {
		const category = await this.prismaService.category.findUnique({
			where: { id: categoryId, userId },
		});
		if (!category) {
			throw new BadRequestException("Category not found");
		}
		if (category.userId !== userId) {
			throw new BadRequestException(
				"You don't have permission to update this category",
			);
		}
		await this.prismaService.category.update({
			where: { id: categoryId, userId },
			data: { name},
		});
	}
}
