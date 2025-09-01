import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class CreateCategoryService {
	constructor(private readonly prismaService: PrismaService) {}
	async execute(name: string, userId: string): Promise<void> {
		const categoryExists = await this.prismaService.category.findFirst({
			where: {
				userId,
				name,
			},
		});
		if (categoryExists) {
			throw new BadRequestException("Category already exists");
		}
		await this.prismaService.category.create({
			data: {
				name,
				userId,
			},
		});
		return;
	}
}
