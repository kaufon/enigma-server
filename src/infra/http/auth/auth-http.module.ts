import {
	ForgotPasswordController,
	SignInController,
	SignUpController,
	ResetPasswordWithPassphraseController,
	ResetPasswordWithTokenController,
} from "@/infra/http/auth/controllers";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		SignUpController,
		SignInController,
		ForgotPasswordController,
		ResetPasswordWithTokenController,
		ResetPasswordWithPassphraseController,
	],
	imports: [ServiceModule],
})
export class AuthHttpModule {}
