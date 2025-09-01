import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/controllers/credentials/credential.controller";
import {
	type ListCredentialsParam,
	ListCredentialsService,
} from "@/infra/services/services/credentials/list-credentials.service";
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
