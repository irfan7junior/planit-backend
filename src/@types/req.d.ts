declare namespace Express {
  interface Request {
    user?: {
      accessToken: string
      displayName: string
      username: string
      profileUrl: string
      photos: Record<string, string>[]
      _id: string
      projects: string[]
    }
  }
}
