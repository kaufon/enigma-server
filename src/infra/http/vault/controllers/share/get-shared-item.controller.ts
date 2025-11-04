import { Public } from "@/infra/auth/public";
import { ShareVaultController } from "@/infra/http/vault/controllers/share/share.controller";
import { GetSharedItemService } from "@/infra/services/vault/services";
import {
	Get,
	Param,
	ParseUUIDPipe,
	HttpCode,
	HttpStatus,
} from "@nestjs/common";

@ShareVaultController()
@Public()
export class GetSharedItemController {
	constructor(private getSharedItemService: GetSharedItemService) {}

	@Get("/:id")
	@HttpCode(HttpStatus.OK)
	async handle(@Param("id", ParseUUIDPipe) id: string) {
		return await this.getSharedItemService.execute(id);
	}
}
