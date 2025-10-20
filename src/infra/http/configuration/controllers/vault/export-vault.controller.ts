import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ConfigurationVaultController } from "@/infra/http/configuration/controllers/vault/configuration-vault.controller";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";
import { ExportVaultService } from "@/infra/services/configuration/services";
import { passwordSchema } from "@/validation/schemas/zod";
import { Body, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import z from "zod";

export const exportVaultSchema = z.object({
	password: passwordSchema,
	format: z.enum(["json", "csv"]),
	exportPassword: passwordSchema.optional(),
});
export type ExportVaultBody = z.infer<typeof exportVaultSchema>;
const bodyValidationPipe = new ZodValidationPipe(exportVaultSchema);
@ConfigurationVaultController()
export class ExportVaultController {
	constructor(private exportVaultService: ExportVaultService) {}

	@Post("/export")
	async handle(
		@Body(bodyValidationPipe) body: ExportVaultBody,
		@CurrentUser() user: UserPayload,
		@Res() res: Response,
	) {
		const { password, format, exportPassword } = body;
		const { data, mime, filename } = await this.exportVaultService.execute(
			user.sub,
			password,
			format,
			exportPassword,
		);
		res.setHeader("Content-Type", mime);
		res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
		console.log("Exporting vault with filename:", filename);
		res.send(data);
	}
}
