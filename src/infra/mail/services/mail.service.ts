import { EnvService } from "@/infra/env/env.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailerService.name);
	constructor(
		private readonly mailerService: MailerService,
		private env: EnvService,
	) {}
	async sendPasswordResetEmail(email: string, token: string) {
		const nodeEnv = this.env.get("ENV");
		const resetLink = `enigma://reset-password?token=${token}`;

		if (nodeEnv === "dev") {
			this.logger.warn("Envio de email no ambiente de dev nao rola!");
			this.logger.warn("--- DEVELOPMENT EMAIL ---");
			this.logger.warn(`To: ${email}`);
			this.logger.warn("Subject: Reset your password");
			this.logger.warn(`Reset Link: ${resetLink}`);
			this.logger.warn("--- END OF EMAIL ---");
			return;
		}
		await this.mailerService.sendMail({
			to: email,
			subject: "Reset your password",
			template: "../templates/reset-password.hbs",
			context: {
				resetLink,
			},
		});
	}
}
