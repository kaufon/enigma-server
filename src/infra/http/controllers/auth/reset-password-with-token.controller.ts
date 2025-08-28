import { Public } from "@/infra/auth/public";
import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { ResetPasswordWithTokenService } from "@/infra/services/services/auth/reset-password-with-token.service";
import { passwordSchema, stringSchema } from "@/validation/schemas/zod";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const resetPasswordWithTokenSchema = z.object({
	token: stringSchema,
	newPassword: passwordSchema,
});

export type ResetPasswordWithTokenBody = z.infer<
	typeof resetPasswordWithTokenSchema
>;
const bodyValidationPipe = new ZodValidationPipe(resetPasswordWithTokenSchema);

@Public()
@AuthController()
export class ResetPasswordWithTokenController {
	constructor(
		private readonly resetPasswordWithTokenService: ResetPasswordWithTokenService,
	) {}

	@Post("/reset-password/verify-token")
	async resetPassword(
		@Body(bodyValidationPipe) body: ResetPasswordWithTokenBody,
	): Promise<void> {
		return this.resetPasswordWithTokenService.execute(body);
	}
}
