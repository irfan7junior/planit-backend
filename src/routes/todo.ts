import { Router } from "express"
import { ProjectModel } from "../entities/Project"
import { Todo, TodoModel } from "../entities/Todo"

const router = Router()

// GET TODOS
router.get("/", async (req, res) => {
    try {
        const todos = await TodoModel.find({})
        return res.status(200).json({
            error: false,
            todos,
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Could not get ALL TODOS",
        })
    }
})

// POST TODO
router.post("/", async (req, res) => {
    try {
        const { completed, description, projectId } = req.body as Omit<
            Todo,
            "projectId"
        > & { projectId: string }
        const newTodo = await TodoModel.create({
            completed,
            description,
            projectId,
        })
        await newTodo.save()
        const project = await ProjectModel.findOne({ _id: projectId })
        if (!project) throw new Error("Cannot find project with that ID")

        project.todos?.push(newTodo)
        await project.save()
        res.status(201).json({
            error: false,
            newTodo,
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Could not create a TODO",
        })
    }
})

// GET todo
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todo = await TodoModel.findOne({ _id: id })
        if (!todo) throw new Error("")
        return res.status(200).json({
            error: false,
            todo,
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Could not GET todo",
        })
    }
})

// PUT todo
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { description, completed } = req.body
        const todo = await TodoModel.findOne({ _id: id })
        if (!todo) throw new Error("")

        todo.completed = completed
        todo.description = description

        await todo.save()

        return res.status(201).json({
            error: false,
            todo,
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: "Could not PUT todo",
        })
    }
})

// DELETE todo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todo = await TodoModel.findOne({
            _id: id,
        })
        if (!todo) throw new Error("")
        await todo.remove()
        return res.status(200).json({
            error: false,
            message: "Successful DELETE todo",
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Could not DELETE todo",
        })
    }
})

export default router
