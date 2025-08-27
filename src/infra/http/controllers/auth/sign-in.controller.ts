import { Public } from "@/infra/auth/public";
import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { SignInService } from "@/infra/services/services/auth/sign-in.service";
import { Body, Post, UsePipes } from "@nestjs/common";
import z from "zod";

export const signUpBodySchema = z.object({
	email: z.string(),
	password: z.string().min(6),
});
export type SignUpBody = z.infer<typeof signUpBodySchema>;

@Public()
@AuthController()
export class SignInController {
	constructor(private signInService: SignInService) {}

	@Post("/sign-in")
	@UsePipes(new ZodValidationPipe(signUpBodySchema))
	async handle(@Body() body: SignUpBody): Promise<{ acessToken: string }> {
		const { email, password } = body;
		return await this.signInService.execute(email, password);
	}
}
