import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ListEmergencyVaultItemsService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
		private bcryptHasher: BcryptHasher,
	) {}
	async execute(userId: string, emergencyVaultPassword: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("Usuário não encontrado");
		}
		if (!user.emergencyVaultMasterKey) {
			throw new BadRequestException("Voce não possui cofre de emergência");
		}
		const isPasswordValid = await this.bcryptHasher.compare(
			emergencyVaultPassword,
			user.emergencyVaultMasterKey,
		);
    console.log(isPasswordValid);
		if (!isPasswordValid) {
			throw new BadRequestException("Senha do cofre de emergência inválida");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const safeNotes = await this.prismaService.safeNote.findMany({
			where: { userId, isEmergency: true },
			orderBy: { createdAt: "desc" },
		});
		const credentials = await this.prismaService.credential.findMany({
			where: { userId, isEmergency: true },
			orderBy: { createdAt: "desc" },
		});
		const decryptedCredentials = credentials.map((credential) => {
			return this.encryptionService.getDecryptedCredential(
				{
					id: credential.id,
					encryptedTitleIv: credential.encryptedTitleIv,
					encryptedTitleContent: credential.encryptedTitleContent,
					encryptedUsernameIv: credential.encryptedUsernameIv,
					encryptedUsernameContent: credential.encryptedUsernameContent,
					encryptedUrlIv: credential.encryptedUrlIv,
					encryptedUrlContent: credential.encryptedUrlContent,
					categoryId: credential.categoryId ?? undefined,
				},
				userDataKey,
			);
		});
		const decryptedSafeNotes = safeNotes.map((credential) => {
			return this.encryptionService.getDecryptedSafeNote(
				{
					id: credential.id,
					encryptedTitleIv: credential.encryptedTitleIv,
					encryptedTitleContent: credential.encryptedTitleContent,
					categoryId: credential.categoryId ?? undefined,
				},
				userDataKey,
			);
		});
		return {
			credentials: decryptedCredentials,
			safeNotes: decryptedSafeNotes,
		};
	}
}
