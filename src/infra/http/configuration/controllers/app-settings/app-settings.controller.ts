import { applyDecorators, Controller } from "@nestjs/common";

export function AppSettingsController() {
	return applyDecorators(Controller("/app-settings"));
}
