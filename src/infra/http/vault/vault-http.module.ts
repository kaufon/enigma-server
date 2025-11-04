import {
	CreateCredentialController,
	CreateSafeNoteController,
	CreateShareController,
	DeleteCredentialController,
	DeleteSafeNoteController,
	EditCredentialDetailController,
	EditSafeNoteController,
	GetCredentialDetailController,
	GetSafeNoteDetailsController,
	GetSharedItemController,
	ListCredentialsController,
	ListEmergencyVaultItemsController,
	ListMySharesController,
	ListSafeNoteController,
	RevokeAccessShareController,
} from "@/infra/http/vault/controllers";
import { VaultHealthReportController } from "@/infra/http/vault/controllers/reports/vault-health-report.controller";
import { ServiceModule } from "@/infra/services/service.module";
import { Module } from "@nestjs/common";

@Module({
	controllers: [
		CreateCredentialController,
		DeleteCredentialController,
		EditCredentialDetailController,
		GetCredentialDetailController,
		ListCredentialsController,
		CreateSafeNoteController,
		ListSafeNoteController,
		GetSafeNoteDetailsController,
		EditSafeNoteController,
		DeleteSafeNoteController,
		ListEmergencyVaultItemsController,
		CreateShareController,
		GetSharedItemController,
		RevokeAccessShareController,
		ListMySharesController,
    VaultHealthReportController
	],
	imports: [ServiceModule],
})
export class VaultHttpModule {}
