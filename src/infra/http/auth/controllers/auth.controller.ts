import { applyDecorators, Controller } from "@nestjs/common";

export function AuthController() {
	return applyDecorators(Controller("/auth"));
}
