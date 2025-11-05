import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/configuration/controllers/security/security.controller";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { SetupReportService } from "@/infra/services/configuration/services";
import { booleanSchema, passwordSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const setupReportSchema = z.object({
	masterPassword: passwordSchema,
	reportNotificationEnabled: booleanSchema,
	reportNotificationSchedule: z.enum(["monthly", "daily", "weekly", "1s"]),
});
export type SetupReportBody = z.infer<typeof setupReportSchema>;
const bodyValidationPipe = new ZodValidationPipe(setupReportSchema);
@SecurityController()
export class SetupReportController {
	constructor(private setupReportService: SetupReportService) {}

	@Post("/setup-report")
	async handle(
		@Body(bodyValidationPipe) body: SetupReportBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		const {
			masterPassword,
			reportNotificationEnabled,
			reportNotificationSchedule,
		} = body;
		return await this.setupReportService.execute(
			user.sub,
			masterPassword,
			reportNotificationEnabled,
			reportNotificationSchedule,
		);
	}
}
