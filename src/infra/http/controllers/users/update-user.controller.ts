import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { UsersController } from "@/infra/http/controllers/users/users.controller";
import { UpdateUserService } from "@/infra/services/services/users/update-user.service";
import { emailSchema, passwordSchema } from "@/validation/schemas/zod";
import { Body, Param, Put } from "@nestjs/common";
import z from "zod";

export const updateUserSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});
export type SignUpBody = z.infer<typeof updateUserSchema>;

@UsersController()
export class UpdateUserController {
	constructor(private upadateUserService: UpdateUserService) {}

	@Put("/update")
	async handle(
		@Body() body: SignUpBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		return await this.upadateUserService.execute(
			user.sub,
			body.email,
			body.password,
		);
	}
}
