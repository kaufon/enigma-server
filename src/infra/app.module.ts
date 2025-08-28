import { Module } from "@nestjs/common";
import { HttpModule } from "src/infra/http/http.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "@/infra/env/env";
import { EnvModule } from "@/infra/env/env.module";
import { AuthModule } from "@/infra/auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { EnvService } from "@/infra/env/env.service";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		MailerModule.forRootAsync({
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: (envService: EnvService) => {
				return {
					transport: {
						host: envService.get("MAIL_HOST"),
						port: Number(envService.get("MAIL_PORT")),
						auth: {
							user: envService.get("MAIL_USER"),
							pass: envService.get("MAIL_PASS"),
						},
					},
					defaults: {
						from: `"No Reply" <naoresponse@examplo.com>`,
					},
					template: {
						dir: join(__dirname, "..", "infra", "mail", "templates"),
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				};
			},
		}),
		HttpModule,
		EnvModule,
		AuthModule,
	],
})
export class AppModule {}
