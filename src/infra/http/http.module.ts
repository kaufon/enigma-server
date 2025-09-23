import {
	SignUpController,
	SignInController,
	GetCurrentUserController,
	UpdateUserController,
	DeleteUserController,
	SetupEmergencyPassphraseController,
	ForgotPasswordController,
	ResetPasswordWithPassphraseController,
	ResetPasswordWithTokenController,
	CreateCredentialController,
	ListCredentialsController,
	GetCredentialDetailController,
	EditCredentialDetailController,
	CreateCategoryController,
	FindAllCategoriesController,
	EditCategoryController,
	DeleteCategoryController,
	DeleteCredentialController,
} from "@/infra/http/controllers";
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
		ResetPasswordWithPassphraseController,
		ResetPasswordWithTokenController,
		CreateCredentialController,
		ListCredentialsController,
		GetCredentialDetailController,
		EditCredentialDetailController,
		CreateCategoryController,
		FindAllCategoriesController,
		EditCategoryController,
		DeleteCategoryController,
		DeleteCredentialController,
	],
	imports: [ServiceModule],
})
export class HttpModule {}
