import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CategoryController } from "@/infra/http/controllers/categories/category.controller";
import {
	Category,
	FindAllCategoriesService,
} from "@/infra/services/services/categories/find-all-categories.service";
import { Get } from "@nestjs/common";

@CategoryController()
export class FindAllCategoriesController {
	constructor(private findAllCategoriesService: FindAllCategoriesService) {}
	@Get("/list")
	async handle(@CurrentUser() user: UserPayload): Promise<Category[]> {
		return await this.findAllCategoriesService.execute(user.sub);
	}
}
