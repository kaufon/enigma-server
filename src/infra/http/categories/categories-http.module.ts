import {
	CreateCategoryController,
	DeleteCategoryController,
	EditCategoryController,
	FindAllCategoriesController,
    GetCategoryDetailsController,
} from "@/infra/http/categories/controllers";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		CreateCategoryController,
    GetCategoryDetailsController,
		EditCategoryController,
		FindAllCategoriesController,
		DeleteCategoryController,
	],
	imports: [ServiceModule],
})
export class CategoryHttpModule {}
