import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose'
import { Project, ProjectModel } from './Project'

@pre<Todo>('save', function (next) {
  this.updatedAt = new Date()
  next()
})
@pre<Todo>('remove', async function (next) {
  await ProjectModel.findOneAndUpdate(
    {
      _id: this.projectId,
    },
    {
      $pull: {
        todos: this._id,
      },
    }
  )
  next()
})
export class Todo {
  @prop({ ref: 'Project' })
  projectId!: Ref<Project>

  @prop({})
  description!: string

  @prop({})
  completed!: boolean

  @prop({ default: new Date() })
  createdAt?: Date

  @prop({ default: new Date() })
  updatedAt?: Date
}

export const TodoModel = getModelForClass(Todo)
