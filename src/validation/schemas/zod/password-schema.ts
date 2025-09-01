import { stringSchema } from "@/validation/schemas/zod/string-schema";


export const passwordSchema = stringSchema
  .min(12, { message: 'A senha deve ter no mínimo 12 caracteres.' })
  .max(32, { message: 'A senha deve ter no máximo 32 caracteres.' })
  .regex(/[a-z]/, { message: 'A senha deve conter no mínimo uma letra minúscula.' })
  .regex(/[A-Z]/, { message: 'A senha deve conter no mínimo uma letra maiúscula.' })
  .regex(/\d/, { message: 'A senha deve conter no mínimo um número.' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'A senha deve conter no mínimo um caractere especial.' });
