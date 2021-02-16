import { getModelForClass, prop, pre, Ref } from '@typegoose/typegoose'
import { Schema } from 'mongoose'
import { Project, ProjectModel } from './Project'
import { modelOptions, Severity } from '@typegoose/typegoose'

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@pre<User>('remove', async function (next) {
  ProjectModel.collection.deleteMany({
    _id: {
      $in: this.projects,
    },
  })
  next()
})
export class User {
  @prop({ unique: true })
  public githubId!: string

  @prop({ required: false })
  displayName!: string

  @prop({ required: true })
  accessToken!: string

  @prop({ required: false })
  profileUrl!: string

  @prop({ required: false, type: Schema.Types.Array })
  photos!: { value: string }[]

  @prop({ ref: 'Project' })
  projects?: Ref<Project>[]

  @prop({ default: new Date() })
  createdAt?: Date

  @prop({ default: new Date() })
  updatedAt?: Date
}

export const UserModel = getModelForClass(User)
