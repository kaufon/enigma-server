import { UsersController } from "@/infra/http/controllers/users/users.controller";
import { DeleteUserService } from "@/infra/services/services/users/delete-user.service";
import { Body, Delete, Param, Put } from "@nestjs/common";
import z from "zod";

export const deleteUserSchema = z.object({
	email: z.string(),
	password: z.string().min(6),
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
