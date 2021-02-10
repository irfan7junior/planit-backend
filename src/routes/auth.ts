import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get(
  '/auth/github',
  passport.authenticate('github', {
    scope: ['gist'],
  })
)

router.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    res.redirect(process.env.FRONT_END)
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(process.env.FRONT_END)
})

export default router
