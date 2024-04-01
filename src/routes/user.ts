import { Router } from "express"
import { ProjectModel } from "../entities/Project"
import { UserModel } from "../entities/User"

const router = Router()

router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.status(200).json({
            error: false,
            users,
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Could not GET users",
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserModel.findOne({ _id: id })
        if (!user) throw new Error("")
        res.status(200).json({
            error: false,
            user,
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Could not GET user",
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserModel.findOne({ _id: id })
        if (!user) throw new Error("")
        await user.remove()

        res.json({
            error: false,
            message: "Successful DELETE user",
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: "Could not DELETE user",
        })
    }
})

export default router
