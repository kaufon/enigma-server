import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher {
	private readonly HASH_SALT_LENGTH = 8;
	async compare(plainValue: string, hashedValue: string): Promise<boolean> {
		return compare(plainValue, hashedValue);
	}
	async hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT_LENGTH);
	}
}
