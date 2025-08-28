import { EnvModule } from "@/infra/env/env.module";
import { MailService } from "@/infra/mail/services/mail.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [MailService],
	exports: [MailService],
	imports: [EnvModule],
})
export class MailModule {}
