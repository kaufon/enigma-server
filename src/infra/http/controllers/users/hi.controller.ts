import { Controller, Get } from "@nestjs/common";
@Controller("")
export class HiController {
	constructor() {}

	@Get("/hi")
	async handle() {
		return { message: "Hello, World!" };
	}
}
