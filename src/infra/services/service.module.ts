import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { SetupEmergencyPassphraseController } from "@/infra/http/controllers/security/setup-emergency-passphrase.controller";
import { MailModule } from "@/infra/mail/mail.module";
import { ForgotPasswordService } from "@/infra/services/services/auth/forgot-password.service";
import { ResetPasswordWithPassphraseService } from "@/infra/services/services/auth/reset-password-with-passphrase.service";
import { ResetPasswordWithTokenService } from "@/infra/services/services/auth/reset-password-with-token.service";
import { SignInService } from "@/infra/services/services/auth/sign-in.service";
import { SignUpService } from "@/infra/services/services/auth/sign-up.service";
import { SetupEmergencyPassphraseService } from "@/infra/services/services/security/setup-emergency-passphrase.service";
import { DeleteUserService } from "@/infra/services/services/users/delete-user.service";
import { GetCurrentUserService } from "@/infra/services/services/users/get-current-user.service";
import { UpdateUserService } from "@/infra/services/services/users/update-user.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		SignUpService,
		SignInService,
		GetCurrentUserService,
		UpdateUserService,
		DeleteUserService,
		SetupEmergencyPassphraseService,
		ForgotPasswordService,
		ResetPasswordWithPassphraseService,
    ResetPasswordWithTokenService,
	],
	exports: [
		SignUpService,
		SignInService,
		GetCurrentUserService,
		UpdateUserService,
		DeleteUserService,
		SetupEmergencyPassphraseService,
		ForgotPasswordService,
		ResetPasswordWithPassphraseService,
    ResetPasswordWithTokenService,
	],
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
})
export class ServiceModule {}
