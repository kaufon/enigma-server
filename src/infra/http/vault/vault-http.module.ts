import {
	CreateCredentialController,
	CreateSafeNoteController,
	DeleteCredentialController,
	EditCredentialDetailController,
	GetCredentialDetailController,
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
	],
	imports: [ServiceModule],
})
export class VaultHttpModule {}
