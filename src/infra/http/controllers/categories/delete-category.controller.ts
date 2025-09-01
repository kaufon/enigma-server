import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/controllers/categories/category.controller";
import { DeleteCategoryService } from "@/infra/services/services/categories/delete-category.service";
import { Delete, Param } from "@nestjs/common";

@CategoryController()
export class DeleteCategoryController {
	constructor(private deleteCategoryService: DeleteCategoryService) {}
	@Delete("/delete/:id")
	async handle(
		@CurrentUser() user: UserPayload,
		@Param("id") categoryId: string,
	): Promise<void> {
		return await this.deleteCategoryService.execute(categoryId, user.sub);
	}
}
