import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { SafeNoteController } from "@/infra/http/vault/controllers/safe-note/safe-note.controller";
import { EditSafeNoteService } from "@/infra/services/vault/services";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Param, Put } from "@nestjs/common";
import z from "zod";

export const editSafeNoteBodySchema = z.object({
	title: stringSchema.optional(),
	content: stringSchema.optional(),
	categoryId: stringSchema.optional().nullable(),
});

export type EditedPlainSafeNote = z.infer<typeof editSafeNoteBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editSafeNoteBodySchema);

@SafeNoteController()
export class EditSafeNoteController {
	constructor(private editSafeNoteService: EditSafeNoteService) {}

	@Put("/edit/:id")
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: EditedPlainSafeNote,
		@Param("id") credentialId: string,
	) {
		return await this.editSafeNoteService.execute(user.sub, credentialId, body);
	}
}
