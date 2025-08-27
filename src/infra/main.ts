import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EnvService } from "@/infra/env/env.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService)
  const port = configService.get("PORT")
	const config = new DocumentBuilder()
		.setTitle("Enigma API")
		.setDescription("The Enigma API description")
		.setVersion("0.0.1")
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, documentFactory);
	await app.listen(port);
}
bootstrap();
