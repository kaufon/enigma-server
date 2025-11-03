import { applyDecorators, Controller } from "@nestjs/common";

export function EmergencyVaultController() {
	return applyDecorators(Controller("/emergency-vault"));
}
