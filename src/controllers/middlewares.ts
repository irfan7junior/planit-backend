import { RequestHandler } from 'express'

export const isAuth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else
    res.status(401).json({
      error: true,
      message: 'You are not authorized to view this resource.',
    })
}
