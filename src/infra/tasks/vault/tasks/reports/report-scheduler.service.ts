import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { VaultPdfReportService } from "@/infra/services/vault/services";
import { Cron, CronExpression } from "@nestjs/schedule";
import { User } from "@prisma/client";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { MailService } from "@/infra/mail/services/mail.service";

@Injectable()
export class ReportSchedulerService {
	constructor(
		private prisma: PrismaService,
		private pdfService: VaultPdfReportService,
		private emailService: MailService,
		private encrpytionService: EncryptionService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	async handleCron() {
		console.log("Rodando verificação de relatórios de saúde...");
		const today = new Date();
		const isFirstDayOfMonth = today.getDate() === 1;
		const isFirstDayOfWeek = today.getDay() === 0;
		const usersToSendReport: User[] = [];

		if (isFirstDayOfMonth) {
			const usersToNotify = await this.prisma.user.findMany({
				where: {
					reportNotificationEnabled: true,
					reportNotificationSchedule: "monthly",
				},
			});

			for (const user of usersToNotify) {
				usersToSendReport.push(user);
			}
		}
		if (isFirstDayOfWeek) {
			const weeklyUsers = await this.prisma.user.findMany({
				where: {
					reportNotificationEnabled: true,
					reportNotificationSchedule: "weekly",
				},
			});
			for (const user of weeklyUsers) {
				usersToSendReport.push(user);
			}
		}
		const secondlyUsers = await this.prisma.user.findMany({
			where: {
				reportNotificationEnabled: true,
				reportNotificationSchedule: "1s",
			},
		});
		for (const user of secondlyUsers) {
			usersToSendReport.push(user);
		}
		const dailyUsers = await this.prisma.user.findMany({
			where: {
				reportNotificationEnabled: true,
				reportNotificationSchedule: "daily",
			},
		});
		for (const user of dailyUsers) {
			usersToSendReport.push(user);
		}
		if (usersToSendReport.length === 0) {
			console.log("Nenhum relatório para enviar hoje.");
			return;
		}
		for (const user of usersToSendReport) {
			await this.sendReportToUser(user);
		}
	}

	private async sendReportToUser(user: User) {
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
		try {
			const pdfBuffer = await this.pdfService.generatePdf(user.id);

			await this.emailService.sendPdfReportEmail(email, pdfBuffer);

			console.log(`Relatório enviado para ${email}`);
		} catch (error) {
			console.error(`Falha ao enviar relatório para ${user.id}:`, error);
		}
	}
}
