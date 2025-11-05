import { Injectable } from "@nestjs/common";
import { VaultHealthReportService } from "./vault-health-report.service";
import PDFDocument = require("pdfkit");

@Injectable()
export class VaultPdfReportService {
	constructor(private healthReportService: VaultHealthReportService) {}

	async generatePdf(userId: string, userEmail: string): Promise<Buffer> {
		const report = await this.healthReportService.execute(userId);

		return new Promise((resolve) => {
			const doc = new PDFDocument({ margin: 50 });
			const buffers: Buffer[] = [];

			doc.on("data", buffers.push.bind(buffers));
			doc.on("end", () => {
				resolve(Buffer.concat(buffers));
			});

			doc.fontSize(20).text("Relatório de Saúde do Cofre", { align: "center" });
			doc.moveDown();

			doc.fontSize(12).text(`Relatório para: ${userEmail}`); // <--- Importante
			doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
			doc.moveDown(2);

			doc.fontSize(16).text("Sumário da Segurança", { underline: true });
			doc.moveDown();

			doc
				.fontSize(14)
				.fillColor("black")
				.text(`Total de Credenciais: ${report.totalCredentials}`);
			doc.moveDown(0.5);

			doc
				.fillColor(report.strengthCounts.weak > 0 ? "red" : "green")
				.text(`Senhas Fracas: ${report.strengthCounts.weak}`);
			doc.moveDown(0.5);

			doc
				.fillColor(report.duplicatedCredentials > 0 ? "red" : "green")
				.text(`Senhas Duplicadas: ${report.duplicatedCredentials}`);
			doc.moveDown(0.5);

			doc
				.fillColor(report.oldCredentials > 0 ? "orange" : "green")
				.text(`Senhas Antigas (> 1 ano): ${report.oldCredentials}`);
			doc.moveDown(2);

			doc
				.fillColor("black")
				.fontSize(16)
				.text("Detalhes da Força", { underline: true });
			doc.moveDown();
			doc
				.fontSize(12)
				.fillColor("green")
				.text(`Fortes: ${report.strengthCounts.strong}`)
				.fillColor("blue")
				.text(`Médias: ${report.strengthCounts.medium}`)
				.fillColor("red")
				.text(`Fracas: ${report.strengthCounts.weak}`);

			doc
				.fontSize(10)
				.text("Relatório gerado pelo Enigma Password Manager.", 50, 700, {
					align: "center",
					lineBreak: false,
				});

			doc.end();
		});
	}
}
