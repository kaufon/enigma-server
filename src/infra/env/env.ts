import {
	appModeSchema,
	integerSchema,
	stringSchema,
} from "@/validation/schemas/zod";
import { z } from "zod";

export const envSchema = z.object({
	ENV: appModeSchema,
	DATABASE_URL: stringSchema,
	JWT_PRIVATE_KEY: stringSchema,
	JWT_PUBLIC_KEY: stringSchema,
	PORT: integerSchema,
	PEPPER: stringSchema,
	MAIL_HOST: stringSchema,
	MAIL_PORT: integerSchema,
	MAIL_USER: stringSchema,
	MAIL_PASS: stringSchema,
  MASTER_KEY: stringSchema,
  SALT_ROUNDS: integerSchema,
  ENCRYPTION_ALGORITHM: stringSchema,
});

export type Env = z.infer<typeof envSchema>;
