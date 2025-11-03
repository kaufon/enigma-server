import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { EmergencyVaultController } from "@/infra/http/vault/controllers/emergency-vault/emergency-vault.controller";
import { ListEmergencyVaultItemsService } from "@/infra/services/vault/services";
import { Body, Get, Post } from "@nestjs/common";
import z from "zod";

export const listVaultItemsBodySchema = z.object({
	emergencyVaultPassword: z.string().min(1, "Senha é obrigatória"),
});
export type ListEmergencyVaultItemsBody = z.infer<
	typeof listVaultItemsBodySchema
>;

const zodValidationPipe = new ZodValidationPipe(listVaultItemsBodySchema);

@EmergencyVaultController()
export class ListEmergencyVaultItemsController {
	constructor(
		private listEmergencyVaultItemsService: ListEmergencyVaultItemsService,
	) {}

	@Post("/list")
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(zodValidationPipe) body: ListEmergencyVaultItemsBody,
	) {
		return await this.listEmergencyVaultItemsService.execute(
			user.sub,
			body.emergencyVaultPassword,
		);
	}
}
