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

	@Put("/update/:id")
	async handle(
		@Body() body: SignUpBody,
		@Param("id") id: string,
	): Promise<void> {
		return await this.upadateUserService.execute(
      id,
			body.email,
			body.password,
		);
	}
}
