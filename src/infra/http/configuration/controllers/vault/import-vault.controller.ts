import {
	Post,
	Body,
	UploadedFile,
	UseInterceptors,
	ParseFilePipe,
	MaxFileSizeValidator,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import type { Express } from "express";
import { ConfigurationVaultController } from "@/infra/http/configuration/controllers/vault/configuration-vault.controller";
import { ImportVaultService } from "@/infra/services/configuration/services";
import { passwordSchema } from "@/validation/schemas/zod";
import z from "zod";
import { ZodValidationPipe } from "@/infra/http/global/pipes/zod-validation.pipe";


export const importVaultSchema = z.object({
	password: passwordSchema,
	format: z.enum(["json", "csv"]),
});
export type ImportVaultBody = z.infer<typeof importVaultSchema>;
const bodyValidationPipe = new ZodValidationPipe(importVaultSchema);

@ConfigurationVaultController()
export class ImportVaultController {
	constructor(private importVaultService: ImportVaultService) {}

	@Post("/import")
	@UseInterceptors(FileInterceptor("file"))
	async handle(
		@Body(bodyValidationPipe) body: ImportVaultBody,
		@CurrentUser() user: UserPayload,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), 
				],
			}),
		)
		file: Express.Multer.File, 
	) {
    console.log('ImportVaultController.handle called with user:', user.sub);
    console.log({ body, filePresent: !!file });
		if (!file) {
			throw new BadRequestException("Nenhum arquivo enviado.");
		}

		const fileContent = file.buffer.toString("utf8");

		return this.importVaultService.execute(user.sub, body, fileContent);
	}
}
