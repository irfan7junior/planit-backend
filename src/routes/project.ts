import { Router } from 'express'
import { Project, ProjectModel } from '../entities/Project'
import { UserModel } from '../entities/User'

const router = Router()

// GET ALL PROJECTS
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectModel.find({})
    return res.status(200).json({
      error: false,
      projects,
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'Unable to fetch all projects',
    })
  }
})

// POST PROJECT
router.post('/', async (req, res) => {
  try {
    const { title } = req.body as Project

    const newProject = await ProjectModel.create({
      title,
      userId: req.user!._id,
    })
    const user = await UserModel.findOne({ _id: req.user!._id })
    user?.projects?.push(newProject._id)

    await Promise.all([user?.save(), newProject.save()])

    res.status(201).json({
      error: false,
      project: newProject,
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'Details not provided or internal error!',
    })
  }
})

// GET PROJECT
router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findOne({
      _id: req.params.id,
    }).populate('todos')

    if (!project) throw new Error('project not find!')
    return res.status(200).json({
      error: false,
      project,
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'Unable to fetch project',
    })
  }
})

// PUT PROJECT
router.put('/:id', async (req, res) => {
  try {
    const projectId = req.params.id
    const { title } = req.body as Pick<Project, 'title'>
    const project = await ProjectModel.findOne({ _id: projectId })
    project!.title = title
    await project?.save()

    return res.status(201).json({
      error: false,
      project,
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'Could not updated PROJECT',
    })
  }
})

// DELETE PROJECT
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const foundProject = await ProjectModel.findOne({ _id: id })
    if (!foundProject) throw new Error('')
    await foundProject?.remove()
    return res.status(200).json({
      error: false,
      message: 'DELETE project is successful',
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: 'Could not delete PROJECT',
    })
  }
})

export default router
