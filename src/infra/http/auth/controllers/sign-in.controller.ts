// Importe os decorators necessários do Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiProperty } from '@nestjs/swagger';
import { Public } from "@/infra/auth/public";
import { emailSchema, passwordSchema } from "@/validation/schemas/zod";
import { Body, Post, UsePipes, Controller } from "@nestjs/common";
import z from "zod";
import { SignInService } from '@/infra/services/auth/services';
import { ZodValidationPipe } from '@/infra/http/global/pipes/zod-validation.pipe';

// --- DTOs para o Swagger ---
// É uma boa prática definir a "forma" do corpo da requisição com uma classe
export class SignInBodyDto {
    @ApiProperty({ example: 'johndoe@example.com', description: 'O e-mail do usuário.' })
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'A senha do usuário.' })
    password: string;
}

// Opcional, mas bom para documentar a resposta de sucesso
export class SignInResponseDto {
    @ApiProperty({ description: 'Token de acesso JWT.' })
    accessToken: string;
}

// Schema Zod para validação (você pode manter o nome signUpBodySchema se for compartilhado)
export const signInBodySchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
export type SignInBody = z.infer<typeof signInBodySchema>;


// --- Controller com documentação Swagger ---
@ApiTags('Auth') // 👈 Agrupa todos os endpoints deste controller sob a tag "Auth" no Swagger
@Public()
@Controller('auth') // Usei o @Controller padrão que corrigimos antes
export class SignInController {
    constructor(private signInService: SignInService) {}

    @Post("/sign-in")
    // --- Decorators do Swagger ---
    @ApiOperation({ summary: 'Autenticar um usuário', description: 'Realiza o login do usuário e retorna um token de acesso.' })
    @ApiBody({ type: SignInBodyDto }) // 👈 Descreve o corpo da requisição
    @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso.', type: SignInResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos no corpo da requisição.' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    // ----------------------------
    @UsePipes(new ZodValidationPipe(signInBodySchema))
    async handle(@Body() body: SignInBody): Promise<{ accessToken: string }> {
        const { email, password } = body;
        
        // Corrigindo o nome da propriedade para corresponder ao seu código original e ao DTO
        const { acessToken } = await this.signInService.execute(email, password);
        return { accessToken: acessToken };
    }
}
