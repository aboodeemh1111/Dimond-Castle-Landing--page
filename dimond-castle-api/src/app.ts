import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import blogsRouter from './routes/blogs'
import pagesRouter from './routes/pages'
import mediaRouter from './routes/media'
import themeRouter from './routes/theme'
import navigationRouter from './routes/navigation'
import contactRouter from './routes/contact'
import activityRouter from './routes/activity'
import settingsRouter from './routes/settings'
import authRouter from './routes/auth'
import productsRouter from './routes/products'
import servicesRouter from './routes/services'
import heroRouter from './routes/hero'
import storyRouter from './routes/story'
import visionRouter from './routes/vision'
import valuesRouter from './routes/values'
import clientsRouter from './routes/clients'

const app = express()

app.use(helmet())
// CORS configuration - allow all origins in development
app.use(cors({
  origin: true, // Allow all origins
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(morgan('dev'))
app.use(rateLimit({ windowMs: 60_000, max: 300 }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.use('/api/blogs', blogsRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/media', mediaRouter)
app.use('/api/theme', themeRouter)
app.use('/api/navigation', navigationRouter)
app.use('/api/contact', contactRouter)
app.use('/api/activity', activityRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/hero', heroRouter)
app.use('/api/story', storyRouter)
app.use('/api/vision', visionRouter)
app.use('/api/values', valuesRouter)
app.use('/api/clients', clientsRouter)

// Not found handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

export default app


