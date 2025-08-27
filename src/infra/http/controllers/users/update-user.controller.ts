import { UsersController } from "@/infra/http/controllers/users/users.controller";
import { UpdateUserService } from "@/infra/services/services/users/update-user.service";
import { Body, Param, Put } from "@nestjs/common";
import z from "zod";

export const updateUserSchema = z.object({
	email: z.string(),
	password: z.string().min(6),
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
