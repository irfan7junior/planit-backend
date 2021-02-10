import { Router } from 'express'
import authRouter from './auth'
import { isAuth } from '../controllers/middlewares'
import secretRoutes from './secret'

const router = Router()

router.use('/', authRouter)

router.use('/secret/', isAuth, secretRoutes)

router.get('/current_user', (req, res) => {
  res.json({
    authenticated: req.user ? true : false,
    user: req.user,
  })
})

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<a href='/logout'>Logout</a><br/><pre>${JSON.stringify(req.user)}</pre>`
    )
  } else {
    res.send(`<a href='/auth/github'>Login</a>`)
  }
})

export default router
