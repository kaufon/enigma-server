import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SafeNoteController } from "@/infra/http/vault/controllers/safe-note/safe-note.controller";
import { DeleteSafeNoteService } from "@/infra/services/vault/services";
import { Delete, Param } from "@nestjs/common";

@SafeNoteController()
export class DeleteSafeNoteController {
	constructor(private deleteSafeNoteService: DeleteSafeNoteService) {}

	@Delete("/delete/:id")
	async handle(@CurrentUser() user: UserPayload, @Param("id") id: string) {
		return await this.deleteSafeNoteService.execute(user.sub, id);
	}
}
