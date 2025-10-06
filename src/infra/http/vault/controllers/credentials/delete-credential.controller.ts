import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/vault/controllers/credentials/credential.controller";
import { DeleteCredentialService } from "@/infra/services/vault/services";
import { Delete, Get, Param } from "@nestjs/common";

@CredentialController()
export class DeleteCredentialController {
	constructor(private deleteCredentialService: DeleteCredentialService) {}

	@Delete("/delete/:id")
	async handle(@CurrentUser() user: UserPayload, @Param("id") id: string) {
		return await this.deleteCredentialService.execute(user.sub, id);
	}
}
