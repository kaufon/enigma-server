import { applyDecorators, Controller } from "@nestjs/common";

export function ShareVaultController() {
	return applyDecorators(Controller("/share"));
}
