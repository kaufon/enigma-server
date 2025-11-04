import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { ShareVaultController } from "@/infra/http/vault/controllers/share/share.controller";
import { CreateShareService } from "@/infra/services/vault/services";
import { passwordSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const createShareBodySchema = z.object({
	credentialId: z.string("ID de credencial inválido"),
	masterPassword: passwordSchema,
	expiresIn: z.enum(["1h", "24h", "7d"]),
	deleteOnRead: z.boolean(),
});
export type CreateShareBody = z.infer<typeof createShareBodySchema>;

const zodValidationPipe = new ZodValidationPipe(createShareBodySchema);
@ShareVaultController()
export class CreateShareController {
	constructor(private creeateShareService: CreateShareService) {}
	@Post("/create")
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(zodValidationPipe) body: CreateShareBody,
	) {
		return await this.creeateShareService.execute(user.sub, body);
	}
}
