import { Public } from "@/infra/auth/public";
import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { SignUpService } from "@/infra/services/services/auth/sign-up.service";
import { Body, Post, UsePipes } from "@nestjs/common";
import z from "zod";

export const signUpBodySchema = z.object({
	email: z.string(),
	password: z.string().min(6),
});
export type SignUpBody = z.infer<typeof signUpBodySchema>;

@Public()
@AuthController()
export class SignUpController {
	constructor(private signUpService: SignUpService) {}
	@Post("/sign-up")
	@UsePipes(new ZodValidationPipe(signUpBodySchema))
	async handle(@Body() body: SignUpBody): Promise<void> {
		const { email, password } = body;
		return await this.signUpService.execute(email, password);
	}
}
