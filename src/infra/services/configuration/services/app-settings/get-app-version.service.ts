import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export interface AppVersionConfig {
  [key: string]: string;
}

@Injectable()
export class GetAppVersionService {
  constructor(private prisma: PrismaService) {}

  async execute(): Promise<AppVersionConfig> {
    const settings = await this.prisma.appSetting.findMany();

    const versionConfig = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as AppVersionConfig);

    return versionConfig;
  }
}
