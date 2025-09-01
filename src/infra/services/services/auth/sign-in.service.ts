import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class SignInService {
	constructor(
		private prismaService: PrismaService,
		private hashGenerator: BcryptHasher,
		private jwtEncrypter: JwtEncrypter,
	) {}
	async execute(
		email: string,
		password: string,
	): Promise<{ acessToken: string }> {
		const user = await this.prismaService.user.findUnique({
			where: { emailHash: this.hashGenerator.createEmailHash(email) },
		});
		if (!user) {
			throw new BadRequestException("Invalid credentials");
		}
		const isPasswordValid = await this.hashGenerator.compare(
			password,
			user.masterKey,
		);
		if (!isPasswordValid) {
			throw new BadRequestException("Invalid credentials");
		}
		const acessToken = await this.jwtEncrypter.encrypt({
			sub: user.id,
		});
		return { acessToken: acessToken };
	}
}
