import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export type DecryptedCredential = {
	id: string;
	title: string;
	username: string;
	url?: string;
	password?: string;
	categoryId?: string;
};
export type ListCredentialsParam = {
	categoryId?: string;
};

@Injectable()
export class ListCredentialsService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(
		userId: string,
		params: ListCredentialsParam,
	): Promise<DecryptedCredential[]> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("User not found");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const whereClause: Prisma.CredentialWhereInput = { userId };
		if (params.categoryId) {
			whereClause.categoryId = params.categoryId;
		}
		const credentials = await this.prismaService.credential.findMany({
			where: whereClause,
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
		return decryptedCredentials;
	}
}
