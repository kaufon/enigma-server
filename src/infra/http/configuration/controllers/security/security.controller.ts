import { applyDecorators, Controller } from "@nestjs/common";

export function SecurityController() {
	return applyDecorators(Controller("/security"));
}
