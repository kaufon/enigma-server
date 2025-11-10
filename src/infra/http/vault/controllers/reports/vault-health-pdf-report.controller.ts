import { Get, Res } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { VaultPdfReportService } from "@/infra/services/vault/services";
import { VaultReportsController } from "@/infra/http/vault/controllers/reports/reports.controller";
import type { Response } from "express";

@VaultReportsController()
export class VaultPdfHealthReportController {
	constructor(private pdfReportService: VaultPdfReportService) {}
	@Get("/vault-health/pdf")
	async handle(@CurrentUser() user: UserPayload, @Res() res: Response) {
		const pdfBuffer = await this.pdfReportService.generatePdf(
			user.sub,
		); 

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			'attachment; filename="Relatorio_Saude_Cofre.pdf"',
		);

		res.send(pdfBuffer);
	}
}
