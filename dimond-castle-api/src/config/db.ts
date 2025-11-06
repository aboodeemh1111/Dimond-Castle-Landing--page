import mongoose from 'mongoose'
import { env } from './env'

export async function connectDB() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI not set')
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.MONGODB_URI)
}


