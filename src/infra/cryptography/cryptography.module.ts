import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { EncryptionService } from "@/infra/cryptography/encryption.service";
import { EnvService } from "@/infra/env/env.service";
import { EnvModule } from "@/infra/env/env.module";

@Module({
  imports: [EnvModule],
	providers: [BcryptHasher, JwtEncrypter, EncryptionService],
	exports: [BcryptHasher, JwtEncrypter, EncryptionService],
})
export class CryptographyModule {}
