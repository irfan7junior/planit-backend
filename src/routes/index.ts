import { Router } from 'express'
import { Octokit } from '@octokit/core'

import authRouter from './auth'
import projectRouter from './project'
import todoRouter from './todo'
import userRouter from './user'

import { isAuth } from '../controllers/middlewares'
import secretRoutes from './secret'

const router = Router()

router.use('/', authRouter)

router.use('/users', isAuth, userRouter)

router.use('/projects', isAuth, projectRouter)

router.use('/todos', isAuth, todoRouter)

router.use('/secret', isAuth, secretRoutes)

router.get('/current_user', (req, res) => {
  res.json({
    authenticated: req.user ? true : false,
    user: req.user,
  })
})

router.get('/create_gist', async (req, res) => {
  const octokit = new Octokit({
    auth: req.user?.accessToken,
  })
  const response = await octokit.request('POST /gists', {
    files: {
      title: {
        content: 'working this one is just going to be fine!',
      },
    },
  })
  console.log(response.data)
  res.json({
    data: response.data,
  })
})

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<a href='/logout'>Logout</a><br/><pre>${JSON.stringify(
        req.user,
        null,
        2
      )}</pre>`
    )
  } else {
    res.send(`<a href='/auth/github'>Login</a>`)
  }
})

export default router
