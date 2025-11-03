import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/configuration/controllers/security/security.controller";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { SetupEmergencyVaultService } from "@/infra/services/configuration/services";
import { passwordSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const setupEmergencyVaultSchema = z.object({
	password: passwordSchema,
	emergencyVaultPassword: passwordSchema,
});
export type SetupEmergenctVaultBody = z.infer<typeof setupEmergencyVaultSchema>;
const bodyValidationPipe = new ZodValidationPipe(setupEmergencyVaultSchema);
@SecurityController()
export class SetupEmergencyVaultController {
	constructor(private setupEmergencyVaultService: SetupEmergencyVaultService) {}

	@Post("/setup-emergency-vault")
	async handle(
		@Body(bodyValidationPipe) body: SetupEmergenctVaultBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		const { password, emergencyVaultPassword } = body;
		return await this.setupEmergencyVaultService.execute(
			user.sub,
			password,
			emergencyVaultPassword,
		);
	}
}
