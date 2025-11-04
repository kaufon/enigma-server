import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import zxcvbn from "zxcvbn";

export interface VaultHealthReport {
	totalCredentials: number;
	duplicatedCredentials: number;
	strengthCounts: {
		strong: number;
		medium: number;
		weak: number;
	};
}

@Injectable()
export class VaultHealthReportService {
	constructor(
		private prisma: PrismaService,
		private encryptionService: EncryptionService,
	) {}

	async execute(userId: string): Promise<VaultHealthReport> {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new InternalServerErrorException("Usuário não encontrado.");
		}
		const applicationMasterKey =
			this.encryptionService.getApplicationMasterKey();
		const userDataKey = this.encryptionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const credentials = await this.prisma.credential.findMany({
			where: { userId },
			select: {
				id: true,
				encryptedPasswordIv: true,
				encryptedPasswordContent: true,
			},
		});

		const passwords: string[] = [];
		for (const c of credentials) {
			if (c.encryptedPasswordIv && c.encryptedPasswordContent) {
				try {
					const pass = this.encryptionService.decrypt(
						{
							iv: c.encryptedPasswordIv,
							content: c.encryptedPasswordContent,
						},
						userDataKey,
					);
					passwords.push(pass);
				} catch (e) {
					console.warn(
						`Falha ao descriptografar credencial ${c.id} para relatório.`,
					);
				}
			}
		}

		const passwordCounts = new Map<string, number>();
		for (const password of passwords) {
			passwordCounts.set(password, (passwordCounts.get(password) || 0) + 1);
		}

		let duplicatedItemsCount = 0;
		for (const count of passwordCounts.values()) {
			if (count > 1) {
				duplicatedItemsCount += count;
			}
		}

		const strengthCounts = { weak: 0, medium: 0, strong: 0 };
		for (const password of passwords) {
			const result = zxcvbn(password);
			if (result.score <= 1) {
				strengthCounts.weak++;
			} else if (result.score <= 3) {
				strengthCounts.medium++;
			} else {
				strengthCounts.strong++;
			}
		}

		return {
			totalCredentials: passwords.length,
			duplicatedCredentials: duplicatedItemsCount,
			strengthCounts,
		};
	}
}
