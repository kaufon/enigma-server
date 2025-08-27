import { Module } from "@nestjs/common";
import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "@/infra/cryptography/jwt-encrypter";
import { EncryptionService } from "@/infra/cryptography/encryption.service";

@Module({
	providers: [BcryptHasher, JwtEncrypter, EncryptionService],
	exports: [BcryptHasher, JwtEncrypter, EncryptionService],
})
export class CryptographyModule {}
