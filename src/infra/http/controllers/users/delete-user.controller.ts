import { UsersController } from "@/infra/http/controllers/users/users.controller";
import { DeleteUserService } from "@/infra/services/services/users/delete-user.service";
import { emailSchema, passwordSchema } from "@/validation/schemas/zod";
import { Body, Delete, Param, Put } from "@nestjs/common";
import z from "zod";

export const deleteUserSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});
export type SignUpBody = z.infer<typeof deleteUserSchema>;

@UsersController()
export class DeleteUserController {
	constructor(private deleteUserService: DeleteUserService) {}

	@Delete("/delete/:id")
	async handle(
		@Body() body: SignUpBody,
		@Param("id") id: string,
	): Promise<void> {
		return await this.deleteUserService.execute(id, body.email, body.password);
	}
}
