import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from './services/passport'
import ConnectMongo from 'connect-mongo'

import { mongoURI, connectionOptions } from './entities/moongose'
import mongoose from 'mongoose'
import router from './routes/index'
import { __prod__ } from './constant'

// process.env.NODE_ENV = 'production'
// process.env.PORT = 5000
const PORT = process.env.PORT || 5000
const app = express()

const main = async () => {
  // Mongo DB connection
  const connection = await mongoose.connect(mongoURI, connectionOptions)
  console.log('mongoDB connected')

  // MongoStore and SessionStore
  const MongoStore = ConnectMongo(session)
  const sessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions',
  })
  // express setup
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors({
      origin: process.env.FRONT_END,
      credentials: true,
    })
  )

  app.set('trust proxy', 1)

  // express-session setup
  app.use(
    session({
      secret: process.env.SESSION_KEY as string,
      resave: true,
      saveUninitialized: true,
      name: process.env.COOKIE_NAME,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // expiration time is one day
        secure: false,
        sameSite: 'lax',
        // domain: process.env.FRONT_END,
      },
      store: sessionStore,
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.use(router)

  app.listen(PORT, () => {
    console.log('listening on port: ', PORT)
  })
}

main()
