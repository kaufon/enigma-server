import { SignInController } from "@/infra/http/controllers/auth/sign-in.controller";
import { SignUpController } from "@/infra/http/controllers/auth/sign-up.controller";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [SignUpController,SignInController],
  imports: [ServiceModule]
})
export class HttpModule {}
