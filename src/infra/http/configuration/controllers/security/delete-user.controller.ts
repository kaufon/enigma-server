import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { SecurityController } from "@/infra/http/configuration/controllers/security/security.controller";
import { DeleteUserService } from "@/infra/services/configuration/services";
import { emailSchema, passwordSchema } from "@/validation/schemas/zod";
import { Body, Delete, Param, Put } from "@nestjs/common";
import z from "zod";

export const deleteUserSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});
export type SignUpBody = z.infer<typeof deleteUserSchema>;

@SecurityController()
export class DeleteUserController {
	constructor(private deleteUserService: DeleteUserService) {}

	@Delete("/delete-account")
	async handle(
		@Body() body: SignUpBody,
		@CurrentUser() user: UserPayload,
	): Promise<void> {
		return await this.deleteUserService.execute(
			user.sub,
			body.email,
			body.password,
		);
	}
}
