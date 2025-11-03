import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { CredentialController } from "@/infra/http/vault/controllers/credentials/credential.controller";
import { CreateCredentialService } from "@/infra/services/vault/services";
import { stringSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const createCredentialBodySchema = z.object({
	title: stringSchema,
	username: stringSchema,
	password: stringSchema,
	isEmergency: z.boolean().optional().default(false),
	url: z.string().optional(),
	categoryId: z.string().optional(),
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
		const { title, username, password, url, categoryId,isEmergency } =
			createCredentialBodySchema.parse(body);
		await this.createCredentialService.execute(
			user.sub,
			title,
			username,
			password,
      isEmergency,
			url,
			categoryId,
		);
	}
}
