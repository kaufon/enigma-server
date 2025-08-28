import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadGatewayException, Injectable } from "@nestjs/common";

@Injectable()
export class GetCurrentUserService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
		private env: EnvService,
	) {}

	async execute(user: { sub: string }) {
		const userId = user.sub;
		const prismaUser = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!prismaUser) {
			throw new BadGatewayException("User not found");
		}
		try {
			const masterKeyString = this.env.get("MASTER_KEY");
			const applicationMasterKey = Buffer.from(masterKeyString, "hex");
			const [userKeyIv, userKeyContent] =
				prismaUser.encryptedDataKey.split(":");

			const userDataKey = this.encryptionService.decrypt(
				{ iv: userKeyIv, content: userKeyContent },
				applicationMasterKey,
			);

			const decryptedEmail = this.encryptionService.decrypt(
				{
					iv: prismaUser.encryptedEmailIv,
					content: prismaUser.encryptedEmailContent,
				},
				Buffer.from(userDataKey, "hex"),
			);
			const isUserInDanger = !prismaUser.emergencyPassphraseHash;
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
