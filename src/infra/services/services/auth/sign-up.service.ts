import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { createHmac, randomBytes } from "crypto";
@Injectable()
export class SignUpService {
	constructor(
		private prismaService: PrismaService,
		private hashGenerator: BcryptHasher,
		private encryptionService: EncryptionService,
		private env: EnvService,
	) {}
	private createEmailHash(email: string): string {
		const pepper = this.env.get("PEPPER");
		return createHmac("sha256", pepper).update(email).digest("hex");
	}
	async execute(email: string, password: string): Promise<void> {
		const emailHash = this.createEmailHash(email);
		const userWithSameEmail = await this.prismaService.user.findUnique({
			where: { emailHash },
		});
		if (userWithSameEmail) {
			throw new BadRequestException("Email already in use");
		}
		const hashedPassword = await this.hashGenerator.hash(password);
		const salt = randomBytes(16);
		const encryptionKey = this.encryptionService.getKeyFromPassword(
			password,
			salt,
		);
		const encryptedEmail = this.encryptionService.encrypt(email, encryptionKey);
		await this.prismaService.user.create({
			data: {
				emailHash,
				encryptedEmailIv: encryptedEmail.iv,
				encryptedEmailContent: encryptedEmail.content,
				masterKey: hashedPassword,
				salt: salt.toString("hex"),
			},
		});
	}
}
