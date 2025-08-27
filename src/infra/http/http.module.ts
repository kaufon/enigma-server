import { SignUpController } from "@/infra/http/controllers/auth/sign-up.controller";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";
import { HiController } from "src/infra/http/controllers/users/hi.controller";

@Module({
	controllers: [HiController,SignUpController],
  imports: [ServiceModule]
})
export class HttpModule {}
