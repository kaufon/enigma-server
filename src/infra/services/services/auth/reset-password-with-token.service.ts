import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ResetPasswordWithTokenBody } from '@/infra/http/controllers/auth/reset-password-with-token.controller';
import { Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class ResetPasswordWithTokenService {
  constructor(
    private prisma: PrismaService,
    private hasher: BcryptHasher,
  ) {}

  async execute({ token, newPassword }: ResetPasswordWithTokenBody): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
    if (!user || !user.passwordResetExpiresAt) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
    const now = new Date();
    if (now > user.passwordResetExpiresAt) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
    const newMasterKey = await this.hasher.hash(newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        masterKey: newMasterKey,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });
  }
}
