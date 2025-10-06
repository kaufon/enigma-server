import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export class CreateSafeNoteService {
	constructor(
		private prismaService: PrismaService,
		private encryptionService: EncryptionService,
	) {}
}
