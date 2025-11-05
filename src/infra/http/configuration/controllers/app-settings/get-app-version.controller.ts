import { Public } from "@/infra/auth/public";
import { AppSettingsController } from "@/infra/http/configuration/controllers/app-settings/app-settings.controller";
import { GetAppVersionService } from "@/infra/services/configuration/services";
import { Get } from "@nestjs/common";

@AppSettingsController()
@Public()
export class GetAppVersionController {
  constructor(private getAppVersionService: GetAppVersionService) {}
  @Get("/version")
  async handle() {
    return await this.getAppVersionService.execute();
  }
}
