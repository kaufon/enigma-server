// import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
// import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
// import { PrismaService } from "@/infra/database/prisma/prisma.service";
// import { EnvService } from "@/infra/env/env.service";
// import { AuthController } from "@/infra/http/controllers/auth/auth.controller";
// import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
// import { BadRequestException, Body, Post, UsePipes } from "@nestjs/common";
// import { createHmac } from "crypto";
// import z from "zod";
//
// export const signUpBodySchema = z.object({
// 	email: z.string(),
// 	password: z.string().min(6),
// });
// export type SignUpBody = z.infer<typeof signUpBodySchema>;
//
// @AuthController()
// export class SignInController {
// 	constructor(
// 		private jwtEncrypter: JwtEncrypter,
// 		private encryptionService: EnvService,
// 		private prismaService: PrismaService,
// 		private hasher: BcryptHasher,
// 		private env: EnvService,
// 	) {}
//
// 	private createEmailHash(email: string): string {
// 		const pepper = this.env.get("PEPPER");
// 		return createHmac("sha256", pepper).update(email).digest("hex");
// 	}
//
// 	@Post("/sign-in")
// 	@UsePipes(new ZodValidationPipe(signUpBodySchema))
// 	async handle(@Body() body: SignUpBody): Promise<{ acessToken: string }> {
// 		const { email, password } = body;
// 		const user = await this.prismaService.user.findUnique({
// 			where: { emailHash: this.createEmailHash(email) },
// 		});
// 		if (!user) {
// 			throw new BadRequestException("Invalid credentials");
// 		}
// 		const isPasswordValid = await this.hasher.compare(password, user.masterKey);
// 		if (!isPasswordValid) {
// 			throw new BadRequestException("Invalid credentials");
// 		}
// 		const acessToken = await this.jwtEncrypter.encrypt({
// 			sub: user.id,
// 		});
// 		return { acessToken: acessToken };
// 	}
// }
