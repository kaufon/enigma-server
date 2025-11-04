import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class GetSharedItemService {
  constructor(private prisma: PrismaService) {}

  async execute(shareId: string): Promise<{ encryptedBlob: string }> {
    const result = await this.prisma.$transaction(async (tx) => {
      const item = await tx.sharedItem.findUnique({
        where: { id: shareId },
      });

      if (!item) {
        throw new NotFoundException('Link não encontrado.');
      }

      if (new Date() > item.expiresAt) {
        await tx.sharedItem.delete({ where: { id: shareId } });
        throw new NotFoundException('Link expirado.');
      }

      if (item.deleteOnRead) {
        await tx.sharedItem.delete({ where: { id: shareId } });
        return { encryptedBlob: item.encryptedBlob };
      }
      await tx.sharedItem.update({
        where: { id: shareId },
        data: { accessCount: { increment: 1 } },
      });
      return { encryptedBlob: item.encryptedBlob };
    });

    return result;
  }
}
