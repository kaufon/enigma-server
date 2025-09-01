import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CredentialController } from "@/infra/http/controllers/credentials/credential.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CreateCredentialService } from "@/infra/services/services/credentials/create-credential.service";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const createCredentialBodySchema = z.object({
	title: stringSchema,
	username: stringSchema,
	password: stringSchema,
	url: stringSchema.optional(),
	categoryId: stringSchema.optional(),
});
export type CreateCredentialBody = z.infer<typeof createCredentialBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createCredentialBodySchema);

@CredentialController()
export class CreateCredentialController {
	constructor(private createCredentialService: CreateCredentialService) {}

	@Post("/create")
	async handle(
		@Body(bodyValidationPipe) body: CreateCredentialBody,
		@CurrentUser() user: UserPayload,
	) {
		const { title, username, password, url, categoryId } =
			createCredentialBodySchema.parse(body);
		await this.createCredentialService.execute(
			user.sub,
			title,
			username,
			password,
			url,
			categoryId,
		);
	}
}
