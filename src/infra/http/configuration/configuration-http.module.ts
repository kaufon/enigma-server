import {
	DeleteUserController,
	GetCurrentUserController,
	SetAutolockTimeoutController,
	SetupEmergencyPassphraseController,
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
	],
	imports: [ServiceModule],
})
export class ConfigurationHttpModule {}
