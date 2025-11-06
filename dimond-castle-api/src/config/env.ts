import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
}

if (!env.MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.warn('[env] MONGODB_URI is not set. API will fail to connect to DB.')
}


