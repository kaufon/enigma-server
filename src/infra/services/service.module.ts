import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import { ForgotPasswordService } from "@/infra/services/services/auth/forgot-password.service";
import { ResetPasswordWithPassphraseService } from "@/infra/services/services/auth/reset-password-with-passphrase.service";
import { ResetPasswordWithTokenService } from "@/infra/services/services/auth/reset-password-with-token.service";
import { SignInService } from "@/infra/services/services/auth/sign-in.service";
import { SignUpService } from "@/infra/services/services/auth/sign-up.service";
import { CreateCategoryService } from "@/infra/services/services/categories/create-category.service";
import { DeleteCategoryService } from "@/infra/services/services/categories/delete-category.service";
import { FindAllCategoriesService } from "@/infra/services/services/categories/find-all-categories.service";
import { UpdateCategoryService } from "@/infra/services/services/categories/update-category.service";
import { CreateCredentialService } from "@/infra/services/services/credentials/create-credential.service";
import { EditCredentialDetailService } from "@/infra/services/services/credentials/edit-credential-detail.service";
import { GetCredentialDetailService } from "@/infra/services/services/credentials/get-credential-detail.service";
import { ListCredentialsService } from "@/infra/services/services/credentials/list-credentials.service";
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
		CreateCredentialService,
		ListCredentialsService,
		GetCredentialDetailService,
		EditCredentialDetailService,
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
		DeleteCategoryService,
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
		CreateCredentialService,
		ListCredentialsService,
		GetCredentialDetailService,
		EditCredentialDetailService,
		CreateCategoryService,
		UpdateCategoryService,
		FindAllCategoriesService,
		DeleteCategoryService,
	],
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
})
export class ServiceModule {}
