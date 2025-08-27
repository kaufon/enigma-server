import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { SignInController } from "@/infra/http/controllers/auth/sign-in.controller";
import { SignUpController } from "@/infra/http/controllers/auth/sign-up.controller";
import { Module } from "@nestjs/common";
import { HiController } from "src/infra/http/controllers/users/hi.controller";

@Module({
	controllers: [HiController,SignInController,SignUpController],
  imports: [DatabaseModule,CryptographyModule]
})
export class HttpModule {}
