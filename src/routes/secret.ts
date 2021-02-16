import { Octokit } from '@octokit/core'
import { Router } from 'express'
import { isAuth } from '../controllers/middlewares'
import { Project, ProjectModel } from '../entities/Project'
import { Todo } from '../entities/Todo'

const router = Router()

const makeMDString = (project: Omit<Project, 'todos'> & { todos: Todo[] }) => {
  const totalTodos = project.todos.length
  const incompleteTodos = project.todos.reduce((prevTotal, curTodo) => {
    return prevTotal + (curTodo.completed === false ? 0 : 1)
  }, 0)
  const completeTodo = project.todos.reduce((prevTotal, curTodo) => {
    return prevTotal + (curTodo.completed ? 1 : 0)
  }, 0)
  const title = `# ${project.title}.md`
  const divider = `\n\n---\n\n`
  const summary = `#### **Summary**: ${completeTodo}/${totalTodos} todos completed\n\n`
  let pending = `## Pending\n\n`
  project.todos
    .filter((todo) => todo.completed === false)
    .forEach((todo) => {
      pending = pending.concat(`:white_circle: **${todo.description}**\n\n`)
    })

  let complete = `## Completed\n\n`
  project.todos
    .filter((todo) => todo.completed)
    .forEach((todo) => {
      complete = complete.concat(
        `:white_check_mark: **${todo.description}**\n\n`
      )
    })

  const mdString = title + divider + summary + pending + complete
  return mdString
}

router.post('/gists/:id', isAuth, async (req, res) => {
  try {
    const { id } = req.params

    const octokit = new Octokit({
      auth: req.user?.accessToken,
    })

    const project = await ProjectModel.findOne({ _id: id }).populate('todos')
    const mdString = makeMDString((project as unknown) as any)

    const response = await octokit.request('POST /gists', {
      public: false,
      description: 'Project Task List!',
      files: {
        [`${project?.title}.md`]: {
          content: mdString,
        },
      },
    })

    res.status(200).json({
      error: false,
      message: 'Successful! exported to GitHub gists',
    })
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Failed! Unable to export gist',
    })
  }
})

export default router
