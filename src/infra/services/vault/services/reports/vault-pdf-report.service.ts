import { Injectable } from "@nestjs/common";
import { VaultHealthReportService } from "./vault-health-report.service";
import PDFDocument = require("pdfkit");
import { VaultHealthReport } from "./vault-health-report.service"; // Supondo que você tenha esse tipo
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

// --- Paleta de Cores Profissional ---
const COLOR_PRIMARY = "#3498DB"; // Azul
const COLOR_SUCCESS = "#2ECC71"; // Verde
const COLOR_WARNING = "#F39C12"; // Laranja
const COLOR_DANGER = "#E74C3C"; // Vermelho
const COLOR_MEDIUM = "#9B59B6"; // Roxo (para senhas médias)
const COLOR_TEXT = "#34495E"; // Cinza Escuro (para texto)
const COLOR_LIGHT_TEXT = "#7F8C8D"; // Cinza Claro (para subtextos)
const COLOR_BORDER = "#BDC3C7"; // Cinza (para bordas e linhas)

@Injectable()
export class VaultPdfReportService {
	constructor(
		private healthReportService: VaultHealthReportService,
		private encrpytionService: EncryptionService,
		private prisma: PrismaService,
	) {}

	async generatePdf(userId: string): Promise<Buffer> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error('User not found');
    }
		const applicationMasterKey =
			this.encrpytionService.getApplicationMasterKey();
		const userDataKey = this.encrpytionService.getUserDataKey(
			user.encryptedDataKey,
			applicationMasterKey,
		);
		const email = this.encrpytionService.decrypt(
			{
				iv: user.encryptedEmailIv,
				content: user.encryptedEmailContent,
			},
			userDataKey,
		);
		const report = await this.healthReportService.execute(userId);

		return new Promise((resolve) => {
			const doc = new PDFDocument({
				margin: 50,
				font: "Helvetica",
			});
			const buffers: Buffer[] = [];

			doc.on("data", buffers.push.bind(buffers));
			doc.on("end", () => {
				resolve(Buffer.concat(buffers));
			});

			this.generateHeader(doc, email);
			this.generateSecuritySummary(doc, report);
			this.generateStrengthDetails(doc, report);
			this.generateFooter(doc);

			doc.end();
		});
	}

	private generateHeader(doc: PDFKit.PDFDocument, userEmail: string) {
		doc
			.fillColor(COLOR_TEXT)
			.font("Helvetica-Bold")
			.fontSize(20)
			.text("Relatório de Saúde do Cofre", 110, 57, { align: "left" });

		doc
			.font("Helvetica")
			.fontSize(10)
			.text(`Relatório para: ${userEmail}`, 200, 65, { align: "right" })
			.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 200, 80, {
				align: "right",
			});

		doc.moveDown(3);
	}

	private generateSecuritySummary(
		doc: PDFKit.PDFDocument,
		report: VaultHealthReport,
	) {
		doc.font("Helvetica-Bold").fontSize(16).text("Sumário da Segurança");
		doc.moveDown(0.7);

		let summaryTop = doc.y;

		this.renderSummaryRow(
			doc,
			summaryTop,
			"Total de Credenciais",
			report.totalCredentials.toString(),
			COLOR_TEXT,
		);

		this.renderSummaryRow(
			doc,
			summaryTop,
			"Senhas Fracas",
			report.strengthCounts.weak.toString(),
			report.strengthCounts.weak > 0 ? COLOR_DANGER : COLOR_SUCCESS,
		);
		summaryTop += 30;

		this.renderSummaryRow(
			doc,
			summaryTop,
			"Senhas Duplicadas",
			report.duplicatedCredentials.toString(),
			report.duplicatedCredentials > 0 ? COLOR_DANGER : COLOR_SUCCESS,
		);
		summaryTop += 30;

		this.renderSummaryRow(
			doc,
			summaryTop,
			"Senhas Antigas (> 1 ano)",
			report.oldCredentials.toString(),
			report.oldCredentials > 0 ? COLOR_WARNING : COLOR_SUCCESS,
		);

		doc.y = summaryTop + 40; 
	}
	private renderSummaryRow(
		doc: PDFKit.PDFDocument,
		y: number,
		label: string,
		value: string,
		valueColor: string,
	) {
		doc.save();

		doc
			.strokeColor(COLOR_BORDER)
			.lineWidth(0.5)
			.moveTo(doc.page.margins.left, y)
			.lineTo(doc.page.width - doc.page.margins.right, y)
			.stroke();

		doc
			.font("Helvetica")
			.fontSize(12)
			.fillColor(COLOR_TEXT)
			.text(label, doc.page.margins.left, y + 10); // 10 pixels abaixo da linha

		doc
			.font("Helvetica-Bold")
			.fontSize(12)
			.fillColor(valueColor)
			.text(value, doc.page.margins.left, y + 10, {
				align: "right",
				width: doc.page.width - doc.page.margins.right - doc.page.margins.left,
			});

		doc.restore();
	}

	private generateStrengthDetails(
		doc: PDFKit.PDFDocument,
		report: VaultHealthReport,
	) {
		doc
			.font("Helvetica-Bold")
			.fontSize(16)
			.text("Detalhes da Força das Senhas");
		doc.moveDown(0.7);

		const total = report.totalCredentials;
		if (total === 0) {
			doc
				.font("Helvetica")
				.fontSize(12)
				.fillColor(COLOR_LIGHT_TEXT)
				.text("Nenhuma credencial encontrada.");
			return;
		}

		const barWidth =
			doc.page.width - doc.page.margins.left - doc.page.margins.right;
		const barHeight = 18;
		let currentY = doc.y;

		const strongPercent = report.strengthCounts.strong / total;
		doc
			.fillColor(COLOR_SUCCESS)
			.rect(
				doc.page.margins.left,
				currentY,
				barWidth * strongPercent,
				barHeight,
			)
			.fill();

		const mediumPercent = report.strengthCounts.medium / total;
		doc
			.fillColor(COLOR_MEDIUM)
			.rect(
				doc.page.margins.left + barWidth * strongPercent,
				currentY,
				barWidth * mediumPercent,
				barHeight,
			)
			.fill();

		const weakPercent = report.strengthCounts.weak / total;
		doc
			.fillColor(COLOR_DANGER)
			.rect(
				doc.page.margins.left +
					barWidth * strongPercent +
					barWidth * mediumPercent,
				currentY,
				barWidth * weakPercent,
				barHeight,
			)
			.fill();

		doc.moveDown(1.5);

		currentY = doc.y;
		this.renderLegendItem(
			doc,
			doc.page.margins.left,
			currentY,
			COLOR_SUCCESS,
			`Fortes: ${report.strengthCounts.strong} (${(strongPercent * 100).toFixed(0)}%)`,
		);
		this.renderLegendItem(
			doc,
			220,
			currentY,
			COLOR_MEDIUM,
			`Médias: ${report.strengthCounts.medium} (${(mediumPercent * 100).toFixed(0)}%)`,
		);
		this.renderLegendItem(
			doc,
			380,
			currentY,
			COLOR_DANGER,
			`Fracas: ${report.strengthCounts.weak} (${(weakPercent * 100).toFixed(0)}%)`,
		);
	}

	private renderLegendItem(
		doc: PDFKit.PDFDocument,
		x: number,
		y: number,
		color: string,
		text: string,
	) {
		doc
			.save()
			.fillColor(color)
			.rect(x, y, 10, 10)
			.fill()
			.fillColor(COLOR_TEXT)
			.font("Helvetica")
			.fontSize(10)
			.text(text, x + 15, y, { lineBreak: false })
			.restore();
	}

	private generateFooter(doc: PDFKit.PDFDocument) {
		doc
			.fontSize(10)
			.fillColor(COLOR_LIGHT_TEXT)
			.text(
				"Relatório gerado pelo Enigma Password Manager.",
				doc.page.margins.left,
				doc.page.height - doc.page.margins.bottom + 10,
				{
					align: "center",
					width:
						doc.page.width - doc.page.margins.left - doc.page.margins.right,
				},
			);
	}
}
