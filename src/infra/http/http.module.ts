import { ForgotPasswordController } from "@/infra/http/controllers/auth/forgot-password.controller";
import { ResetPasswordWithPassphraseController } from "@/infra/http/controllers/auth/reset-password-with-passphrase.controller";
import { SignInController } from "@/infra/http/controllers/auth/sign-in.controller";
import { SignUpController } from "@/infra/http/controllers/auth/sign-up.controller";
import { SetupEmergencyPassphraseController } from "@/infra/http/controllers/security/setup-emergency-passphrase.controller";
import { DeleteUserController } from "@/infra/http/controllers/users/delete-user.controller";
import { GetCurrentUserController } from "@/infra/http/controllers/users/get-current-user.controller";
import { UpdateUserController } from "@/infra/http/controllers/users/update-user.controller";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		SignUpController,
		SignInController,
		GetCurrentUserController,
		UpdateUserController,
		DeleteUserController,
		SetupEmergencyPassphraseController,
    ForgotPasswordController,
    ResetPasswordWithPassphraseController
	],
	imports: [ServiceModule],
})
export class HttpModule {}
