import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { Public } from "@/infra/auth/public";
import { OptionalJwtAuthGuard } from "@/infra/auth/public-get-user";
import { ShareVaultController } from "@/infra/http/vault/controllers/share/share.controller";
import { GetSharedItemService } from "@/infra/services/vault/services";
import {
	Get,
	Param,
	ParseUUIDPipe,
	HttpCode,
	HttpStatus,
	UseGuards,
} from "@nestjs/common";

@ShareVaultController()
@Public()
export class GetSharedItemController {
	constructor(private getSharedItemService: GetSharedItemService) {}

	@Get("/:id")
	@UseGuards(OptionalJwtAuthGuard)
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param("id", ParseUUIDPipe) id: string,
		@CurrentUser() user?: UserPayload,
	) {
		return await this.getSharedItemService.execute(id,user?.sub);
	}
}
