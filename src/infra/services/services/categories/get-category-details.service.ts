import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

export type CategoryDetails = {
	id: string;
	name: string;
	credentials: Array<{
		id: string;
		title: string;
	}>;
};

@Injectable()
export class GetCategoryDetailsService {
	constructor(
		private readonly prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
	async execute(userId: string, categoryId: string): Promise<CategoryDetails> {
		const user = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			throw new BadRequestException("Usuário não encontrado");
		}
		const prismaCategory = await this.prismaService.category.findUnique({
			omit: { userId: true, createdAt: true, updatedAt: true },
			where: { userId, id: categoryId },
			include: {
				credentials: {
					select: {
						id: true,
						encryptedTitleContent: true,
						encryptedTitleIv: true,
					},
				},
			},
		});
		if (!prismaCategory) {
			throw new BadRequestException("Categoria não encontrada");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		return {
			id: prismaCategory.id,
			name: prismaCategory.name,
			credentials: prismaCategory.credentials.map((credential) => ({
				id: credential.id,
				title: this.encryptionService.decrypt(
					{
						iv: credential.encryptedTitleIv,
						content: credential.encryptedTitleContent,
					},
					userDataKey,
				),
			})),
		};
	}
}
