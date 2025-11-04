import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ShareVaultController } from "@/infra/http/vault/controllers/share/share.controller";
import {
	RevokeShareService,
} from "@/infra/services/vault/services";
import {
	Param,
	ParseUUIDPipe,
	HttpCode,
	HttpStatus,
	Delete,
} from "@nestjs/common";

@ShareVaultController()
export class RevokeAccessShareController {
	constructor(private revokeShareService: RevokeShareService) {}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param("id", ParseUUIDPipe) id: string,
		@CurrentUser() user: UserPayload,
	) {
		await this.revokeShareService.execute(user.sub, id);
	}
}
