import { ConfigService } from '@nestjs/config';

const DEV_FALLBACK = 'verde-dev-jwt';

export function resolveJwtSecret(config: ConfigService) {
  const secret = config.get<string>('JWT_SECRET')?.trim() ?? '';
  const production =
    (config.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'production';

  if (production && (!secret || secret === DEV_FALLBACK)) {
    throw new Error('JWT_SECRET must be a strong value in production');
  }

  return secret || DEV_FALLBACK;
}
