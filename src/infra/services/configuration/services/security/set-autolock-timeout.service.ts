import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class SetAutoLockTimeoutService {
	constructor(private prisma: PrismaService) {}

	async execute(userId: string, autoLockTimeoutMinutes: number) {
		const user = await this.prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			throw new UnauthorizedException();
		}
		await this.prisma.user.update({
			where: { id: userId },
			data: {
				autoLockTimeout: autoLockTimeoutMinutes,
			},
		});
	}
}
