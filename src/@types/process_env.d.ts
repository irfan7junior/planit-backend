declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI_USERNAME: string
    MONGO_URI_PASSWORD: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    CALLBACK_URL: string
    FRONT_END: string
    NODE_ENV: string
    COOKIE_NAME: string
    DB_NAME: string
    [key: string]: string
  }
}
