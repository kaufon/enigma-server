import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	DeleteUserService,
	GetCurrentUserService,
	SetAutoLockTimeoutService,
	SetupEmergencyPassphraseService,
	UpdateUserService,
} from "@/infra/services/configuration/services";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
	providers: [
		SetupEmergencyPassphraseService,
		SetAutoLockTimeoutService,
		DeleteUserService,
		UpdateUserService,
		GetCurrentUserService,
	],
	exports: [
		SetupEmergencyPassphraseService,
		SetAutoLockTimeoutService,
		DeleteUserService,
		UpdateUserService,
		GetCurrentUserService,
	],
})
export class ConfigurationServiceModule {}
