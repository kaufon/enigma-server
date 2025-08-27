import { EnvModule } from "@/infra/env/env.module";
import { EnvService } from "@/infra/env/env.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
      global: true,
			useFactory(env: EnvService) {
				const privateKey = env.get("JWT_PRIVATE_KEY");
				const publicKey = env.get("JWT_PUBLIC_KEY");
				return {
					signOptions: { algorithm: "RS256", expiresIn: "1h" },
					privateKey: Buffer.from(privateKey, "base64"),
					publicKey: Buffer.from(publicKey, "base64"),
				};
			},
		}),
	],
})
export class AuthModule {}
