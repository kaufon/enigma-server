import {
	CreateCredentialController,
	CreateSafeNoteController,
	DeleteCredentialController,
	DeleteSafeNoteController,
	EditCredentialDetailController,
	EditSafeNoteController,
	GetCredentialDetailController,
	GetSafeNoteDetailsController,
	ListCredentialsController,
	ListSafeNoteController,
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
	],
	imports: [ServiceModule],
})
export class VaultHttpModule {}
