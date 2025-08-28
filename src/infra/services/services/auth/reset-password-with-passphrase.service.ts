import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
} from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { createHmac } from "crypto";
import { ResetPasswordWithPassphraseBody } from "@/infra/http/controllers/auth/reset-password-with-passphrase.controller";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";

@Injectable()
export class ResetPasswordWithPassphraseService {
	constructor(
		private prismaService: PrismaService,
		private env: EnvService,
		private brcryptHasher: BcryptHasher,
	) {}
	private createEmailHash(email: string): string {
		const pepper = this.env.get("PEPPER");
		return createHmac("sha256", pepper).update(email).digest("hex");
	}

	async execute({
		email,
		passphrase,
		newPassword,
	}: ResetPasswordWithPassphraseBody): Promise<void> {
		const user = await this.prismaService.user.findUnique({
			where: { emailHash: this.createEmailHash(email) },
		});
		if (!user) {
			throw new UnauthorizedException("Credenciais inválidas.");
		}
		if (!user.emergencyPassphraseHash) {
			throw new BadRequestException(
				"Usuário não possui uma frase de segurança configurada.",
			);
		}

		const isPassphraseValid = await this.brcryptHasher.compare(
			passphrase,
			user.emergencyPassphraseHash,
		);

		if (!isPassphraseValid) {
			throw new UnauthorizedException("Frase de segurança inválida. Tente novamente");
		}

		const newMasterKey = await this.brcryptHasher.hash(newPassword);

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				masterKey: newMasterKey,
				passwordResetToken: null,
				passwordResetExpiresAt: null,
			},
		});
	}
}
