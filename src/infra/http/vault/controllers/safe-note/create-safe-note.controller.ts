import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { SafeNoteController } from "@/infra/http/vault/controllers/safe-note/safe-note.controller";
import { CreateSafeNoteService } from "@/infra/services/vault/services/safe-note";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const createSafeNoteBodySchema = z.object({
	title: stringSchema,
	content: stringSchema,
	categoryId: z.string().optional(),
});
export type CreateSafeNoteBody = z.infer<typeof createSafeNoteBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createSafeNoteBodySchema);

@SafeNoteController()
export class CreateSafeNoteController {
	constructor(private createSafeNoteService: CreateSafeNoteService) {}

	@Post("/create")
	async handle(
		@Body(bodyValidationPipe) body: CreateSafeNoteBody,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content, categoryId } = createSafeNoteBodySchema.parse(body);
		await this.createSafeNoteService.execute(
			user.sub,
			title,
			content,
			categoryId,
		);
	}
}
