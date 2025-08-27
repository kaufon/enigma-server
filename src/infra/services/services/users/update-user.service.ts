import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { createHmac } from "crypto";

@Injectable()
export class UpdateUserService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
		private env: EnvService,
    private bcryptHasher: BcryptHasher,
	) {}

	private createEmailHash(email: string): string {
		const pepper = this.env.get("PEPPER");
		return createHmac("sha256", pepper).update(email).digest("hex");
	}
	async execute(userId: string, newEmail: string, plainPassword: string) {
		const prismaUser = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!prismaUser) {
			throw new BadGatewayException("User not found");
		}
		const emailHash = this.createEmailHash(newEmail);
    const passwordMatch = await this.bcryptHasher.compare(plainPassword, prismaUser.masterKey);
    if (!passwordMatch) {
      throw new BadGatewayException("Invalid password");
    }
		const userWithSameEmail = await this.prismaService.user.findUnique({
			where: { emailHash, NOT: { id: userId } },
		});
		if (userWithSameEmail && userWithSameEmail.id !== userId) {
			throw new BadGatewayException("Email already in use");
		}
		const encryptionKey = this.encryptionService.getKeyFromPassword(
			prismaUser.masterKey,
			Buffer.from(prismaUser.salt, "hex"),
		);
		const encryptedEmail = this.encryptionService.encrypt(
			newEmail,
			encryptionKey,
		);
		await this.prismaService.user.update({
			where: { id: userId },
			data: {
				emailHash,
				encryptedEmailIv: encryptedEmail.iv,
				encryptedEmailContent: encryptedEmail.content,
			},
		});
	}
}
