import { Public } from "@/infra/auth/public";
import { Controller, Get, Query, Redirect } from "@nestjs/common";

@Controller('redirect')
@Public()
export class RedirectController {
  @Get('open')
  @Redirect()
  handle(@Query('link') link: string) {
    return { url: link, statusCode: 302 };
  }
}
