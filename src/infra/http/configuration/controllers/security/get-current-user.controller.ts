import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/configuration/controllers/security/security.controller";
import { GetCurrentUserService } from "@/infra/services/configuration/services";
import { Get } from "@nestjs/common";

@SecurityController()
export class GetCurrentUserController {
	constructor(private getCurrentUserService: GetCurrentUserService) {}

	@Get("/me")
	async handle(@CurrentUser() user: UserPayload) {
    return await this.getCurrentUserService.execute(user);
	}
}
