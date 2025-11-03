import { applyDecorators, Controller } from "@nestjs/common";

export function SafeNoteController() {
	return applyDecorators(Controller("/safe-note"));
}
