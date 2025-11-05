import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class SetupReportService {
	constructor(
		private prisma: PrismaService,
		private hasher: BcryptHasher,
	) {}

	async execute(
		userId: string,
		masterPassword: string,
		reportNotificationEnabled: boolean,
		reportNotificationSchedule: "1s" | "monthly" | "weekly" | "daily",
	) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new UnauthorizedException();
		}

		const passwordMatches = await this.hasher.compare(
			masterPassword,
			user.masterKey,
		);
		if (!passwordMatches) {
			throw new UnauthorizedException("Senha inválida");
		}

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				reportNotificationEnabled,
				reportNotificationSchedule,
			},
		});
	}
}
