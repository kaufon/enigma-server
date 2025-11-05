import { Module } from '@nestjs/common';
import { ServiceModule } from '@/infra/services/service.module';
import { ReportSchedulerService } from '@/infra/tasks/vault/tasks';
import { DatabaseModule } from '@/infra/database/database.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { MailModule } from '@/infra/mail/mail.module';

@Module({
  imports: [ServiceModule,DatabaseModule,CryptographyModule,MailModule],
  providers: [
    ReportSchedulerService, 
  ],
})
export class VaultTasksModule{}
