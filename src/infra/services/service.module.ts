import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { SignUpService } from "@/infra/services/services/auth/sign-up.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [SignUpService],
	exports: [SignUpService],
	imports: [DatabaseModule, CryptographyModule, EnvModule],
})
export class ServiceModule {}
