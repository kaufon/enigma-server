import { Get } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { VaultHealthReportService } from "@/infra/services/vault/services";
import { VaultReportsController } from "@/infra/http/vault/controllers/reports/reports.controller";

@VaultReportsController()
export class VaultHealthReportController {
	constructor(private reportService: VaultHealthReportService) {}
	@Get("/vault-health")
	async handle(@CurrentUser() user: UserPayload) {
		return this.reportService.execute(user.sub);
	}
}
