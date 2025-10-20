import {
	DeleteUserController,
	ExportVaultController,
	GetCurrentUserController,
	SetAutolockTimeoutController,
	SetupEmergencyPassphraseController,
	SetupEmergencyVaultController,
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
	],
	imports: [ServiceModule],
})
export class ConfigurationHttpModule {}
