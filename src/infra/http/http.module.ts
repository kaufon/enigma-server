import { ForgotPasswordController } from "@/infra/http/controllers/auth/forgot-password.controller";
import { ResetPasswordWithPassphraseController } from "@/infra/http/controllers/auth/reset-password-with-passphrase.controller";
import { ResetPasswordWithTokenController } from "@/infra/http/controllers/auth/reset-password-with-token.controller";
import { SignInController } from "@/infra/http/controllers/auth/sign-in.controller";
import { SignUpController } from "@/infra/http/controllers/auth/sign-up.controller";
import { CreateCategoryController } from "@/infra/http/controllers/categories/create-category.controller";
import { DeleteCategoryController } from "@/infra/http/controllers/categories/delete-category.controller";
import { EditCategoryController } from "@/infra/http/controllers/categories/edit-category.controller";
import { FindAllCategoriesController } from "@/infra/http/controllers/categories/find-all-categories.controller";
import { CreateCredentialController } from "@/infra/http/controllers/credentials/create-credential.controller";
import { EditCredentialDetailController } from "@/infra/http/controllers/credentials/edit-credentail-detail.controller";
import { GetCredentialDetailController } from "@/infra/http/controllers/credentials/get-credential-detail.controller";
import { ListCredentialsController } from "@/infra/http/controllers/credentials/list-credentials.controller";
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
	],
	imports: [ServiceModule],
})
export class HttpModule {}
