import { EnvService } from "@/infra/env/env.service";
import { DecryptedCredential } from "@/infra/services/services/credentials/list-credentials.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import {
	randomBytes,
	createCipheriv,
	createDecipheriv,
	scryptSync,
} from "crypto";

export interface EncryptedData {
	iv: string;
	content: string;
}

@Injectable()
export class EncryptionService {
	private readonly ALGORITHM: string;
	constructor(private env: EnvService) {
		this.ALGORITHM = this.env.get("ENCRYPTION_ALGORITHM");
	}
	encrypt(text: string, key: Buffer): EncryptedData {
		try {
			const iv = randomBytes(16);
			const cipher = createCipheriv(this.ALGORITHM, key, iv);

			const encrypted = Buffer.concat([
				cipher.update(text, "utf8"),
				cipher.final(),
			]);

			return {
				iv: iv.toString("hex"),
				content: encrypted.toString("hex"),
			};
		} catch (error) {
			throw new InternalServerErrorException("Failed to encrypt data.");
		}
	}
	decrypt(hash: EncryptedData, key: Buffer): string {
		try {
			const decipher = createDecipheriv(
				this.ALGORITHM,
				key,
				Buffer.from(hash.iv, "hex"),
			);

			const decrypted = Buffer.concat([
				decipher.update(Buffer.from(hash.content, "hex")),
				decipher.final(),
			]);

			return decrypted.toString("utf8");
		} catch (error) {
			throw new InternalServerErrorException(
				"Failed to decrypt data. Invalid key?",
			);
		}
	}

	getApplicationMasterKey(): Buffer {
		const masterKeyString = this.env.get("MASTER_KEY");
		return Buffer.from(masterKeyString, "hex");
	}
	getKeyFromPassword(password: string, salt: Buffer): Buffer {
		return scryptSync(password, salt, 32) as Buffer;
	}
	getUserDataKey(encryptedDataKey: string, masterKey: Buffer): Buffer {
		const [userKeyIv, userKeyContent] = encryptedDataKey.split(":");
		const userDataKey = Buffer.from(
			this.decrypt({ iv: userKeyIv, content: userKeyContent }, masterKey),
			"hex",
		);
		return userDataKey;
	}
	getDecryptedCredential(
		credential: {
			id: string;
			encryptedTitleIv: string;
			encryptedTitleContent: string;
			encryptedUsernameIv: string;
			encryptedUsernameContent: string;
			encryptedUrlIv: string | null;
			encryptedUrlContent: string | null;
			encryptedPasswordIv?: string;
			encrpytedPasswordContent?: string;
			categoryId?: string;
		},
		userDataKey: Buffer,
	): DecryptedCredential {
		const decrypted: DecryptedCredential = {
			id: credential.id,
			categoryId: credential.categoryId,
			title: this.decrypt(
				{
					iv: credential.encryptedTitleIv,
					content: credential.encryptedTitleContent,
				},
				userDataKey,
			),
			username: this.decrypt(
				{
					iv: credential.encryptedUsernameIv,
					content: credential.encryptedUsernameContent,
				},
				userDataKey,
			),
		};
		if (credential.encryptedUrlIv && credential.encryptedUrlContent) {
			decrypted.url = this.decrypt(
				{
					iv: credential.encryptedUrlIv,
					content: credential.encryptedUrlContent,
				},
				userDataKey,
			);
		}
		if (credential.encryptedPasswordIv && credential.encrpytedPasswordContent) {
			decrypted.password = this.decrypt(
				{
					iv: credential.encryptedPasswordIv,
					content: credential.encrpytedPasswordContent,
				},
				userDataKey,
			);
		}
		return decrypted;
	}
}
