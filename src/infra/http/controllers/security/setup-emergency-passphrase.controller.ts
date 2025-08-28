import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/controllers/security/security.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { SetupEmergencyPassphraseService } from "@/infra/services/services/security/setup-emergency-passphrase.service";
import { Body, Post, UsePipes } from "@nestjs/common";
import z from "zod";

export const setupEmergencyPassphraseSchema = z.object({
	password: z.string().min(6),
	passphrase: z.string().min(6),
});
export type SignUpBody = z.infer<typeof setupEmergencyPassphraseSchema>;
const bodyValidationPipe = new ZodValidationPipe(
	setupEmergencyPassphraseSchema,
);
@SecurityController()
export class SetupEmergencyPassphraseController {
	constructor(
		private setupEmergencyPassphraseService: SetupEmergencyPassphraseService,
	) {}

	@Post("/setup-emergency-passphrase")
	async handle(
		@Body(bodyValidationPipe) body: SignUpBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		const { password, passphrase } = body;
		return await this.setupEmergencyPassphraseService.execute(
			user.sub,
			password,
			passphrase,
		);
	}
}
