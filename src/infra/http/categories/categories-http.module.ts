import {
	CreateCategoryController,
	DeleteCategoryController,
	EditCategoryController,
	FindAllCategoriesController,
} from "@/infra/http/categories/controllers";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		CreateCategoryController,
		EditCategoryController,
		FindAllCategoriesController,
		DeleteCategoryController,
	],
	imports: [ServiceModule],
})
export class CategoryHttpModule {}
