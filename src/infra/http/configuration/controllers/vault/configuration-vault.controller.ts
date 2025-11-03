import { applyDecorators, Controller } from "@nestjs/common";

export function ConfigurationVaultController() {
	return applyDecorators(Controller("/configuration/vault"));
}
