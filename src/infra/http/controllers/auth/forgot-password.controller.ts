import { Public } from "@/infra/auth/public";
import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { ForgotPasswordService } from "@/infra/services/services/auth/forgot-password.service";
import { Body, Post, UsePipes } from "@nestjs/common";
import z from "zod";

export const forgotPasswordBodySchema = z.object({
	email: z.string(),
});
export type SignUpBody = z.infer<typeof forgotPasswordBodySchema>;

@Public()
@AuthController()
export class ForgotPasswordController {
	constructor(private forgotPasswordService: ForgotPasswordService) {}

	@Post("/forgot-password")
	@UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
	async handle(
		@Body() body: SignUpBody,
	): Promise<{ recoveryType: string; message: string }> {
		const { email } = body;
		const recoveryType = await this.forgotPasswordService.execute(email);
		if (recoveryType.recoveryType === "EMAIL") {
			return {
				recoveryType: "EMAIL_LINK",
				message:
					"Um link para recuperação de senha foi enviado para o seu e-mail.",
			};
		} else {
			return {
				recoveryType: "PASS_PHRASE",
				message: "Por favor, informe sua frase de segurança para continuar.",
			};
		}
	}
}
