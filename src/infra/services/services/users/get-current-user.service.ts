import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadGatewayException, Injectable } from "@nestjs/common";

@Injectable()
export class GetCurrentUserService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}

	async execute(user: { sub: string }) {
		const userId = user.sub;
		const prismaUser = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!prismaUser) {
			throw new BadGatewayException("User not found");
		}
		const encryptionKey = this.encryptionService.getKeyFromPassword(
			prismaUser.masterKey,
			Buffer.from(prismaUser.salt, "hex"),
		);
		try {
			const decryptedEmail = this.encryptionService.decrypt(
				{
					iv: prismaUser.encryptedEmailIv,
					content: prismaUser.encryptedEmailContent,
				},
				encryptionKey,
			);
			const isUserInDanger =
				!prismaUser.emergencyPassphraseHash
			const userInDangerReason = isUserInDanger
				? "User has not set up an emergency passphrase"
				: null;
			return {
				id: prismaUser.id,
				email: decryptedEmail,
				danger: isUserInDanger,
				dangerReason: userInDangerReason,
			};
		} catch (error) {
			throw new BadGatewayException(error.message);
		}
	}
}
