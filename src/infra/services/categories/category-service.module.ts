import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	CreateCategoryService,
	DeleteCategoryService,
	FindAllCategoriesService,
	UpdateCategoryService,
} from "@/infra/services/categories/services";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
	providers: [
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
		UpdateCategoryService,
		DeleteCategoryService,
	],
	exports: [
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
		UpdateCategoryService,
		DeleteCategoryService,
	],
})
export class CategoryServiceModule {}
