import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadGatewayException, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteUserService {
	constructor(
		private prismaService: PrismaService,
		private bcryptHasher: BcryptHasher,
	) {}
	async execute(
		userId: string,
		newEmail: string,
		plainPassword: string,
	): Promise<void> {
		const prismaUser = await this.prismaService.user.findUnique({
			where: { id: userId },
		});
		if (!prismaUser) {
			throw new BadGatewayException("Usuario não encontrado");
		}
		const isPasswordValid = await this.bcryptHasher.compare(
			plainPassword,
			prismaUser.masterKey,
		);
		if (!isPasswordValid) {
			throw new BadGatewayException("Credenciais inválidas");
		}
		const emailHash = this.bcryptHasher.createEmailHash(newEmail);
		if (emailHash !== prismaUser.emailHash) {
			throw new BadGatewayException("Credenciais inválidas");
		}
		await this.prismaService.user.delete({
			where: { id: userId, emailHash: emailHash },
		});
		return;
	}
}
