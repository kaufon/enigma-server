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
	],
	imports: [ServiceModule],
})
export class VaultHttpModule {}
