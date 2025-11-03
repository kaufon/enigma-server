import { AuthServiceModule } from "@/infra/services/auth/auth-service.module";
import { CategoryServiceModule } from "@/infra/services/categories/category-service.module";
import { ConfigurationServiceModule } from "@/infra/services/configuration/configuration-service.module";
import { VaultServiceModule } from "@/infra/services/vault/vault-service.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		AuthServiceModule,
		CategoryServiceModule,
		VaultServiceModule,
		ConfigurationServiceModule,
	],
  exports: [
    AuthServiceModule,
    CategoryServiceModule,
    VaultServiceModule,
    ConfigurationServiceModule,
  ]
})
export class ServiceModule {}
