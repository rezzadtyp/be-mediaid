import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

export const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ["https://your-frontend-domain.com"] 
  : ["http://localhost:3000"];

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const NEXT_BASE_URL = process.env.NEXT_BASE_URL;
export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_PUBLIC_CLIENT as string;
export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SECRET as string;