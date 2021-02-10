import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose'
import { Project } from './Project'

@pre<Todo>('save', function (next) {
  this.updatedAt = new Date()
  next()
})
export class Todo {
  @prop({ ref: 'Project' })
  projectId: Ref<Project>

  @prop({})
  description!: string

  @prop({})
  completed!: boolean

  @prop({ default: new Date() })
  createdAt!: Date

  @prop({ default: new Date() })
  updatedAt!: Date
}

export const TodoModel = getModelForClass(Todo)
