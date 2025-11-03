import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/categories/controllers/category.controller";
import { GetCategoryDetailsService } from "@/infra/services/categories/services";
import { CategoryDetails } from "@/infra/services/categories/services/get-category-details.service";
import { Get, Param } from "@nestjs/common";

@CategoryController()
export class GetCategoryDetailsController {
	constructor(private getCategoryDetailsService: GetCategoryDetailsService) {}
	@Get("/details/:categoryId")
	async handle(
		@CurrentUser() user: UserPayload,
		@Param("categoryId") categoryId: string,
	): Promise<CategoryDetails> {
		return await this.getCategoryDetailsService.execute(user.sub, categoryId);
	}
}
