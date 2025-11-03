import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/categories/controllers/category.controller";
import { FindAllCategoriesService } from "@/infra/services/categories/services";
import { Category } from "@/infra/services/categories/services/find-all-categories.service";
import { Get } from "@nestjs/common";

@CategoryController()
export class FindAllCategoriesController {
	constructor(private findAllCategoriesService: FindAllCategoriesService) {}
	@Get("/list")
	async handle(@CurrentUser() user: UserPayload): Promise<Category[]> {
		return await this.findAllCategoriesService.execute(user.sub);
	}
}
