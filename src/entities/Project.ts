import { getModelForClass, prop, Ref, pre } from "@typegoose/typegoose"
import { Todo, TodoModel } from "./Todo"
import { User, UserModel } from "./User"

@pre<Project>("remove", async function (next) {
    await TodoModel.collection.deleteMany({
        _id: {
            $in: this.todos,
        },
    })

    UserModel.updateOne(
        {
            _id: this.userId,
        },
        {
            $pull: {
                projects: this._id,
            },
        },
    )

    next()
})
export class Project {
    @prop({ ref: "User" })
    userId!: Ref<User>

    @prop({ type: String })
    title!: string

    @prop({ default: new Date() })
    createdAt?: Date

    @prop({ ref: "Todo" })
    todos?: Ref<Todo>[]
}

export const ProjectModel = getModelForClass(Project)
