import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { UsersController } from "@/infra/http/controllers/users/users.controller";
import { GetCurrentUserService } from "@/infra/services/services/users/get-current-user.service";
import { Get } from "@nestjs/common";

@UsersController()
export class GetCurrentUserController {
	constructor(private getCurrentUserService: GetCurrentUserService) {}

	@Get("/me")
	async handle(@CurrentUser() user: UserPayload) {
    return await this.getCurrentUserService.execute(user);
	}
}
