import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	CreateCategoryService,
	DeleteCategoryService,
	FindAllCategoriesService,
	GetCategoryDetailsService,
	UpdateCategoryService,
} from "@/infra/services/categories/services";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
	providers: [
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
    GetCategoryDetailsService,
		UpdateCategoryService,
		DeleteCategoryService,
	],
	exports: [
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
		UpdateCategoryService,
    GetCategoryDetailsService,
		DeleteCategoryService,
	],
})
export class CategoryServiceModule {}
