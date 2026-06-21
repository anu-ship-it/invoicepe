import { z } from 'zod';

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number).default('3000'),
  APP_NAME: z.string().default('InvoicePe'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().startsWith('rzp_'),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  RAZORPAY_PLAN_ID_MONTHLY: z.string().startsWith('plan_'),

  // MSG91
  MSG91_AUTH_KEY: z.string().min(1),
  MSG91_SENDER_ID: z.string().length(6),
  MSG91_TEMPLATE_ID_OTP: z.string().min(1),
  MSG91_TEMPLATE_ID_REMINDER: z.string().min(1),
  MSG91_TEMPLATE_ID_PAYMENT_RECEIVED: z.string().min(1),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().min(1),

  // OTP
  OTP_EXPIRY_MINUTES: z.string().transform(Number).default('10'),
  OTP_MAX_ATTEMPTS: z.string().transform(Number).default('3'),
  OTP_RESEND_COOLDOWN_SECONDS: z.string().transform(Number).default('30'),

  // Subscription
  TRIAL_PERIOD_DAYS: z.string().transform(Number).default('14'),
  GRACE_PERIOD_DAYS: z.string().transform(Number).default('3'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // CORS
  ALLOWED_ORIGINS: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1); // Hard crash — never start with bad config
}

export const env = _env.data;
export type Env = typeof env;
