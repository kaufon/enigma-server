import {
	CreateCredentialController,
	CreateSafeNoteController,
	DeleteCredentialController,
	EditCredentialDetailController,
	GetCredentialDetailController,
	ListCredentialsController,
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
	],
	imports: [ServiceModule],
})
export class VaultHttpModule {}
