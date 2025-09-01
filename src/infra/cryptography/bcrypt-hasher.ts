import { EnvService } from "@/infra/env/env.service";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { createHmac } from "crypto";

@Injectable()
export class BcryptHasher {
	constructor(private readonly env: EnvService) {}
	compare(plainValue: string, hashedValue: string): Promise<boolean> {
		return compare(plainValue, hashedValue);
	}
	hash(plain: string): Promise<string> {
		const saltRounds = this.env.get("SALT_ROUNDS");
		return hash(plain, saltRounds);
	}
	createEmailHash(email: string): string {
		const pepper = this.env.get("PEPPER");
		return createHmac("sha256", pepper).update(email).digest("hex");
	}
}
