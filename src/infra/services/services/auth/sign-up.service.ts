import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import {  randomBytes } from "crypto";
@Injectable()
export class SignUpService {
	constructor(
		private prismaService: PrismaService,
		private hashGenerator: BcryptHasher,
		private encryptionService: EncryptionService,
		private env: EnvService,
	) {}
	async execute(email: string, password: string): Promise<void> {
		const emailHash = this.hashGenerator.createEmailHash(email);
		const userWithSameEmail = await this.prismaService.user.findUnique({
			where: { emailHash },
		});
		if (userWithSameEmail) {
			throw new BadRequestException("Email already in use");
		}
		const hashedPassword = await this.hashGenerator.hash(password);
		const userDataKey = randomBytes(32);
		const encryptedEmail = this.encryptionService.encrypt(email, userDataKey);
		const masterKeyString = this.env.get("MASTER_KEY");
		const applicationMasterKey = Buffer.from(masterKeyString, "hex");
		const encryptedDataKey = this.encryptionService.encrypt(
			userDataKey.toString("hex"),
			applicationMasterKey,
		);
		await this.prismaService.user.create({
			data: {
				emailHash,
				encryptedEmailIv: encryptedEmail.iv,
				encryptedEmailContent: encryptedEmail.content,
				masterKey: hashedPassword,
        encryptedDataKey:`${encryptedDataKey.iv}:${encryptedDataKey.content}`
			},
		});
	}
}
