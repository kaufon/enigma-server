import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import {
	BadRequestException,
	Body,
	Controller,
	Post,
	UsePipes,
} from "@nestjs/common";
import z from "zod";

export const signUpBodySchema = z.object({
	email: z.string(),
	password: z.string().min(6),
});
export type SignUpBody = z.infer<typeof signUpBodySchema>;

@Controller("/auth")
export class SignUpController {
	constructor(
		private prismaService: PrismaService,
		private hashGenerator: BcryptHasher,
	) {}

	@Post("/sign-up")
	@UsePipes(new ZodValidationPipe(signUpBodySchema))
	async handle(@Body() body: SignUpBody): Promise<void> {
		const { email, password } = body;
		const userWithSameEmail = await this.prismaService.user.findUnique({
			where: { email },
		});
		if (userWithSameEmail) {
			throw new BadRequestException("Email already in use");
		}
		const hashedPassword = await this.hashGenerator.hash(password);
		await this.prismaService.user.create({
			data: { email, masterKey: hashedPassword },
		});
	}
}
