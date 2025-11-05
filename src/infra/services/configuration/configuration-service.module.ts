import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	DeleteUserService,
	ExportVaultService,
	GetAppVersionService,
	GetCurrentUserService,
	ImportVaultService,
	SetAutoLockTimeoutService,
	SetupEmergencyPassphraseService,
	SetupEmergencyVaultService,
	SetupReportService,
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
		SetupEmergencyVaultService,
    ExportVaultService,
    ImportVaultService,
    SetupReportService,
    GetAppVersionService
	],
	exports: [
		SetupEmergencyPassphraseService,
		SetAutoLockTimeoutService,
		DeleteUserService,
		UpdateUserService,
		GetCurrentUserService,
		SetupEmergencyVaultService,
    ExportVaultService,
    ImportVaultService,
    SetupReportService,
    GetAppVersionService
	],
})
export class ConfigurationServiceModule {}
