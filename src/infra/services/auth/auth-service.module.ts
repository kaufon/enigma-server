import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	ForgotPasswordService,
	ResetPasswordWithPassphraseService,
	ResetPasswordWithTokenService,
	SignInService,
	SignUpService,
} from "@/infra/services/auth/services";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
	providers: [
		ForgotPasswordService,
		ResetPasswordWithPassphraseService,
		ResetPasswordWithTokenService,
		SignUpService,
		SignInService,
	],
	exports: [
		ForgotPasswordService,
		ResetPasswordWithPassphraseService,
		ResetPasswordWithTokenService,
		SignUpService,
		SignInService,
	],
})
export class AuthServiceModule {}
