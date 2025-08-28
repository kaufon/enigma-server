import { Public } from "@/infra/auth/public";
import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
import { ResetPasswordWithPassphraseService } from "@/infra/services/services/auth/reset-password-with-passphrase.service";
import { Body, Post } from "@nestjs/common";
import z from "zod";

export const resetPasswordWithPassphraseSchema = z.object({
	email: z.string().email("Formato de e-mail inválido."),
	passphrase: z.string().min(1, "A frase de segurança não pode estar vazia."),
	newPassword: z
		.string()
		.min(6, "A nova senha deve ter no mínimo 6 caracteres."),
});

export type ResetPasswordWithPassphraseBody = z.infer<
	typeof resetPasswordWithPassphraseSchema
>;
@Public()
@AuthController()
export class ResetPasswordWithPassphraseController {
	constructor(
		private resetPasswordWithPassphraseService: ResetPasswordWithPassphraseService,
	) {}
	@Post("/reset-password/passphrase")
	async handle(@Body() body: ResetPasswordWithPassphraseBody): Promise<void> {
		const { email, passphrase, newPassword } = body;
		return await this.resetPasswordWithPassphraseService.execute({
			email,
			passphrase,
			newPassword,
		});
	}
}
