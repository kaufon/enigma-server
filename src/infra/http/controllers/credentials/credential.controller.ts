import { applyDecorators, Controller } from "@nestjs/common";

export function CredentialController() {
	return applyDecorators(Controller("/credentials"));
}
