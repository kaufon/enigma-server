
import { applyDecorators, Controller } from "@nestjs/common";

export function VaultReportsController() {
	return applyDecorators(Controller("/report"));
}
