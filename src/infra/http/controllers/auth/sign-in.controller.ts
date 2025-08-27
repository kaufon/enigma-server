import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Controller("/auth")
export class SignInController {
	constructor(private jwt: JwtService) {}
	@Post("/sign-in")
	async handle() {
		const token = this.jwt.sign({ sub: "user-id" });
		return token;
	}
}
