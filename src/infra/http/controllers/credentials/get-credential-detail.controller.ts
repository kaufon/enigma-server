import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/controllers/credentials/credential.controller";
import { GetCredentialDetailService } from "@/infra/services/services/credentials/get-credential-detail.service";
import { Get, Param } from "@nestjs/common";

@CredentialController()
export class GetCredentialDetailController {
	constructor(
		private getCredentailsDetailsService: GetCredentialDetailService,
	) {}

	@Get("/details/:id")
	async handle(@CurrentUser() user: UserPayload, @Param("id") id: string) {
		return await this.getCredentailsDetailsService.execute(user.sub, id);
	}
}
