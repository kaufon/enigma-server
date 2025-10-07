import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SafeNoteController } from "@/infra/http/vault/controllers/safe-note/safe-note.controller";
import {
	GetSafeNoteDetailService,
} from "@/infra/services/vault/services";
import { Get, Param } from "@nestjs/common";

@SafeNoteController()
export class GetSafeNoteDetailsController {
	constructor(private getSafeNoteDetailService: GetSafeNoteDetailService) {}

	@Get("/details/:id")
	async handle(@CurrentUser() user: UserPayload, @Param("id") id: string) {
		return await this.getSafeNoteDetailService.execute(user.sub, id);
	}
}
