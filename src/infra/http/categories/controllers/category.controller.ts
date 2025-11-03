
import { applyDecorators, Controller } from "@nestjs/common";

export function CategoryController() {
	return applyDecorators(Controller("/category"));
}
