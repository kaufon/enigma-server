import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ShareVaultController } from "@/infra/http/vault/controllers/share/share.controller";
import {
	ListMySharesService,
} from "@/infra/services/vault/services";
import {
	Get,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";

@ShareVaultController()
export class ListMySharesController {
	constructor(private listMySharesService: ListMySharesService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@CurrentUser() user: UserPayload,
	) {
		return await this.listMySharesService.execute(user.sub);
	}
}
