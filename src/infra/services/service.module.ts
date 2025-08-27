import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { SignInService } from "@/infra/services/services/auth/sign-in.service";
import { SignUpService } from "@/infra/services/services/auth/sign-up.service";
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
	],
	exports: [
		SignUpService,
		SignInService,
		GetCurrentUserService,
		UpdateUserService,
		DeleteUserService,
	],
	imports: [DatabaseModule, CryptographyModule, EnvModule],
})
export class ServiceModule {}
