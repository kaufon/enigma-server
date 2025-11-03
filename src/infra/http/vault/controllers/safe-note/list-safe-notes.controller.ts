import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SafeNoteController } from "@/infra/http/vault/controllers/safe-note/safe-note.controller";
import { ListSafeNotesService } from "@/infra/services/vault/services";
import type { ListSafeNotesParams } from "@/infra/services/vault/services/safe-note/list-safe-notes.service";
import { Get, Query } from "@nestjs/common";

@SafeNoteController()
export class ListSafeNoteController {
	constructor(private listSafeNoteService: ListSafeNotesService) {}

	@Get("/list")
	async handle(
		@CurrentUser() user: UserPayload,
		@Query() params: ListSafeNotesParams,
	) {
		return await this.listSafeNoteService.execute(user.sub, params);
	}
}
