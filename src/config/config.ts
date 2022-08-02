export const ENVIRONMENT = process.env.APP_ENV || 'dev'
export const IS_PRODUCTION = ENVIRONMENT === 'production'
export const IS_TEST = ENVIRONMENT === 'test'
export const APP_PORT = Number(process.env.APP_PORT) || 9000
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || '/'
export const JWT_SECRET = process.env.JWT_SECRET || 'somerandomkeyherena'
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1y'
export const DB = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_USER_PWD,
  HOST: process.env.DB_HOST,
  NAME: process.env.DB_NAME,
  PORT: Number(process.env.DB_PORT) || 27017,
}
export const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/Mocks'
export const EMAIL_SERVICE_PROVIDER = process.env.EMAIL_SERVICE_PROVIDER || 'yandex'
export const EMAIL_SERVICE_HOST = process.env.EMAIL_SERVICE_HOST || 'smtp.yandex.ru'
export const EMAIL_SERVICE_AUTH_USER = process.env.EMAIL_SERVICE_AUTH_USER || ''
export const EMAIL_SERVICE_AUTH_PASSWORD = process.env.EMAIL_SERVICE_AUTH_PASSWORD || ''