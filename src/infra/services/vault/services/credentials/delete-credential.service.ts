import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteCredentialService {
	constructor(private prismaService: PrismaService) {}
	async execute(userId: string, credentailId: string): Promise<void> {
		const credential = await this.prismaService.credential.findUnique({
			where: { userId, id: credentailId },
		});
		if (!credential) {
			throw new BadRequestException("Credencial não encontrada");
		}
    if (credential.userId !== userId) {
      throw new BadRequestException("Sem permissão para deletar essa credencial");
    }
		await this.prismaService.credential.delete({
			where: { id: credentailId },
		});
	}
}
