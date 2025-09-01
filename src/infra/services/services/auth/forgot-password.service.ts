import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { MailService } from "@/infra/mail/services/mail.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

export type ForgotPasswordResponse = {
	recoveryType: "PASSPHRASE" | "EMAIL";
	token?: string;
};

@Injectable()
export class ForgotPasswordService {
	constructor(
		private mailService: MailService,
		private prismaService: PrismaService,
		private bcryptHasher: BcryptHasher,
	) {}
	async execute(email: string): Promise<ForgotPasswordResponse> {
		const user = await this.prismaService.user.findUnique({
			where: { emailHash: this.bcryptHasher.createEmailHash(email) },
		});
		if (!user) {
			throw new BadRequestException("Invalid credentials");
		}
		if (user.emergencyPassphraseHash) {
			return {
				recoveryType: "PASSPHRASE",
			};
		}
		const resetToken = randomBytes(32).toString("hex");
		const expirationDate = new Date();
		expirationDate.setHours(expirationDate.getHours() + 1);
		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				passwordResetToken: resetToken,
				passwordResetExpiresAt: expirationDate,
			},
		});
		await this.mailService.sendPasswordResetEmail(email, resetToken);
		return {
			recoveryType: "EMAIL",
		};
	}
}
