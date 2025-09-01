import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/controllers/categories/category.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { UpdateCategoryService } from "@/infra/services/services/categories/update-category.service";
import { stringSchema } from "@/validation/schemas/zod";
import { Body,  Param, Put } from "@nestjs/common";
import z from "zod";

export const signUpBodySchema = z.object({
	name: stringSchema,
});
export type SignUpBody = z.infer<typeof signUpBodySchema>;
const bodyValidationPipe = new ZodValidationPipe(signUpBodySchema);
@CategoryController()
export class EditCategoryController {
	constructor(private editCategoryService: UpdateCategoryService) {}
	@Put("/edit/:id")
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: SignUpBody,
		@Param("id") categoryId: string,
	): Promise<void> {
		return await this.editCategoryService.execute(body.name, categoryId, user.sub);
	}
}
