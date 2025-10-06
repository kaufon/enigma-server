import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvModule } from "@/infra/env/env.module";
import { MailModule } from "@/infra/mail/mail.module";
import {
	CreateCredentialService,
	DeleteCredentialService,
	EditCredentialDetailService,
	GetCredentialDetailService,
	ListCredentialsService,
	CreateSafeNoteService,
	ListSafeNotesService,
} from "@/infra/services/vault/services";
import { Module } from "@nestjs/common";

@Module({
	imports: [DatabaseModule, CryptographyModule, EnvModule, MailModule],
	providers: [
		ListCredentialsService,
		CreateCredentialService,
		EditCredentialDetailService,
		DeleteCredentialService,
		GetCredentialDetailService,
		CreateSafeNoteService,
		ListSafeNotesService,
	],
	exports: [
		ListCredentialsService,
		CreateCredentialService,
		EditCredentialDetailService,
		DeleteCredentialService,
		GetCredentialDetailService,
		CreateSafeNoteService,
		ListSafeNotesService,
	],
})
export class VaultServiceModule {}
