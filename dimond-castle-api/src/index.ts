import { env } from './config/env'
import { connectDB } from './config/db'
import app from './app'

async function main() {
  await connectDB()
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] listening on http://localhost:${env.PORT}`)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()


