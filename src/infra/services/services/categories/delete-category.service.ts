import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCategoryService {
	constructor(private readonly prismaService: PrismaService) {}
	async execute(
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
		await this.prismaService.$transaction([
			this.prismaService.credential.updateMany({
				where: { categoryId },
				data: { categoryId: null },
			}),
			this.prismaService.category.delete({
				where: { id: categoryId, userId },
			}),
		]);
	}
}
