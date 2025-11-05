import {
	DeleteUserController,
	ExportVaultController,
	GetAppVersionController,
	GetCurrentUserController,
	ImportVaultController,
	SetAutolockTimeoutController,
	SetupEmergencyPassphraseController,
	SetupEmergencyVaultController,
	SetupReportController,
	UpdateUserController,
} from "@/infra/http/configuration/controllers";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		SetupEmergencyPassphraseController,
		SetAutolockTimeoutController,
		DeleteUserController,
		UpdateUserController,
		GetCurrentUserController,
    SetupEmergencyVaultController,
    ExportVaultController,
    ImportVaultController,
    SetupReportController,
    GetAppVersionController
	],
	imports: [ServiceModule],
})
export class ConfigurationHttpModule {}
