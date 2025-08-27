import { applyDecorators, Controller } from "@nestjs/common";

export function UsersController() {
	return applyDecorators(Controller("/users"));
}
