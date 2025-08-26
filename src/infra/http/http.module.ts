import { Module } from "@nestjs/common";
import { HiController } from "src/infra/http/controllers/hi.controller";

@Module({
	controllers: [HiController],
})
export class HttpModule {}
