import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/controllers/categories/category.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CreateCategoryService } from "@/infra/services/services/categories/create-category.service";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const createCategorySchema = z.object({
	name: stringSchema,
});
export type CreateCategoryBody = z.infer<typeof createCategorySchema>;

const bodyValidationPipe = new ZodValidationPipe(createCategorySchema);

@CategoryController()
export class CreateCategoryController {
	constructor(private createCategoryService: CreateCategoryService) {}
	@Post("/create")
	async handle(
		@Body(bodyValidationPipe) body: CreateCategoryBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		return await this.createCategoryService.execute(body.name, user.sub);
	}
}
