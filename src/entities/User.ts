import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { Schema } from 'mongoose'
import { Project } from './Project'

export class User {
  @prop({ unique: true })
  githubId!: string

  @prop({ required: true })
  displayName!: string

  @prop({ required: true })
  accessToken!: string

  @prop({ required: true })
  profileUrl!: string

  @prop({ required: true, type: Schema.Types.Array })
  photos!: { value: string }[]

  @prop({ ref: 'Project' })
  projects?: Ref<Project>[]

  @prop({ default: new Date() })
  createdAt?: Date

  @prop({ default: new Date() })
  updatedAt?: Date
}

export const UserModel = getModelForClass(User)
