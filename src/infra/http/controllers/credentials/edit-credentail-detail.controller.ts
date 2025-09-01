import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/controllers/credentials/credential.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { EditCredentialDetailService } from "@/infra/services/services/credentials/edit-credential-detail.service";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Param, Put } from "@nestjs/common";
import z from "zod";

export const editCredentialBodySchema = z.object({
	title: stringSchema.optional(),
	username: stringSchema.optional(),
	password: stringSchema.optional(),
	url: stringSchema.optional(),
	categoryId: stringSchema.optional().nullable(),
});

export type EditedPlainCrendential = z.infer<typeof editCredentialBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editCredentialBodySchema);

@CredentialController()
export class EditCredentialDetailController {
	constructor(private editCredentialController: EditCredentialDetailService) {}

	@Put("/edit/:id")
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(bodyValidationPipe) body: EditedPlainCrendential,
		@Param("id") credentialId: string,
	) {
		return await this.editCredentialController.execute(
			user.sub,
			credentialId,
			body,
		);
	}
}
