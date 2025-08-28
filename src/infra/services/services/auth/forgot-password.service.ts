import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { EnvService } from "@/infra/env/env.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { createHmac, randomBytes } from "crypto";

export type ForgotPasswordResponse = {
	recoveryType: "PASSPHRASE" | "EMAIL";
  token? : string
};

@Injectable()
export class ForgotPasswordService {
	constructor(
		private prismaService: PrismaService,
		private env: EnvService,
	) {}
	private createEmailHash(email: string): string {
		const pepper = this.env.get("PEPPER");
		return createHmac("sha256", pepper).update(email).digest("hex");
	}
	async execute(email: string): Promise<ForgotPasswordResponse> {
		const user = await this.prismaService.user.findUnique({
			where: { emailHash: this.createEmailHash(email) },
		});
		if (!user) {
			throw new BadRequestException("Invalid credentials");
		}
		const resetToken = randomBytes(32).toString("hex");
		if (user.emergencyPassphraseHash) {
			return {
				recoveryType: "PASSPHRASE",
        token: resetToken
			};
		}
		const expirationDate = new Date(); 
		expirationDate.setHours(expirationDate.getHours() + 1);
		return {
			recoveryType: "EMAIL",
		};
	}
}
