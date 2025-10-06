import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/vault/controllers/credentials/credential.controller";
import { ListCredentialsService } from "@/infra/services/vault/services";
import type { ListCredentialsParam } from "@/infra/services/vault/services/credentials/list-credentials.service";
import { Get, Query } from "@nestjs/common";

@CredentialController()
export class ListCredentialsController {
	constructor(private listCredentialsService: ListCredentialsService) {}

	@Get("/list")
	async handle(
		@CurrentUser() user: UserPayload,
		@Query() params: ListCredentialsParam,
	) {
		return await this.listCredentialsService.execute(user.sub, params);
	}
}
