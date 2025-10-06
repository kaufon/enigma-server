import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/configuration/controllers/security/security.controller";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { SetAutoLockTimeoutService } from "@/infra/services/configuration/services";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const setAutolockTimeoutSchema = z.object({
	autoLockTimeoutMinutes: z.number().min(1).max(999999),
});
export type SetAutolockTimeoutBody = z.infer<typeof setAutolockTimeoutSchema>;
const bodyValidationPipe = new ZodValidationPipe(setAutolockTimeoutSchema);
@SecurityController()
export class SetAutolockTimeoutController {
	constructor(private setAutoLockTimeoutService: SetAutoLockTimeoutService) {}

	@Post("/set-autolock-timeout")
	async handle(
		@Body(bodyValidationPipe) body: SetAutolockTimeoutBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		const { autoLockTimeoutMinutes } = body;
		return await this.setAutoLockTimeoutService.execute(
			user.sub,
			autoLockTimeoutMinutes,
		);
	}
}
