import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { randomBytes } from "crypto";

@Injectable()
export class SetupEmergencyPassphraseService {
	constructor(
		private prisma: PrismaService,
		private hasher: BcryptHasher,
	) {}

	async execute(userId: string, password: string, passphrase: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new UnauthorizedException();
		}

    const passwordMatches = await this.hasher.compare(password, user.masterKey);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid password");
    }
		const emergencyPassphraseHash = await this.hasher.hash(passphrase);

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				emergencyPassphraseHash,
			},
		});
	}
}
