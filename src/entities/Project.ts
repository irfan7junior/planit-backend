import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Todo } from './Todo'
import { User } from './User'

export class Project {
  @prop({ ref: 'User' })
  userId: Ref<User>

  @prop({ type: String })
  title!: string

  @prop({ default: new Date() })
  createdAt!: Date

  @prop({ ref: 'Todo' })
  todos?: Ref<Todo>[]
}

export const ProjectModel = getModelForClass(Project)
