import { Octokit } from '@octokit/core'
import { Router } from 'express'
import { isAuth } from '../controllers/middlewares'

const router = Router()

router.get('/gists', isAuth, async (req, res) => {
  const octokit = new Octokit({
    auth: req.user?.accessToken,
  })

  const response = await octokit.request('GET /gists')
  res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`)
})

export default router
