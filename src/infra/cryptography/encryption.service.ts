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
	private readonly ALGORITHM = "aes-256-cbc"; // AES algorithm with 256-bit key in CBC mode
	getKeyFromPassword(password: string, salt: Buffer): Buffer {
		return scryptSync(password, salt, 32) as Buffer;
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
}
