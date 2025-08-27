import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtEncrypter {
	constructor(private jwtService: JwtService) {}
	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return this.jwtService.signAsync(payload);
	}
}
