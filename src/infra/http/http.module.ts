import { AuthHttpModule } from "@/infra/http/auth/auth-http.module";
import { CategoryHttpModule } from "@/infra/http/categories/categories-http.module";
import { ConfigurationHttpModule } from "@/infra/http/configuration/configuration-http.module";
import { RedirectController } from "@/infra/http/global/controlers/redirect.controller";
import { VaultHttpModule } from "@/infra/http/vault/vault-http.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		AuthHttpModule,
		ConfigurationHttpModule,
		CategoryHttpModule,
		VaultHttpModule,
	],
  controllers:[
    RedirectController
  ]
})
export class HttpModule {}
