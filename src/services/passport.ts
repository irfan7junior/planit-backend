import passport from "passport"
import { Strategy as GithubStrategy } from "passport-github2"
import { User, UserModel } from "../entities/User"

// serialize user
passport.serializeUser((mongoUser, done) => {
    done(null, (mongoUser as User).githubId)
})
// deserialize user
passport.deserializeUser(async (githubId: any, done) => {
    const user = await UserModel.findOne({ githubId })
    return done(null, user as NonNullable<User>)
})

// Github strategy
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            callbackURL: process.env.CALLBACK_URL as string,
            scope: ["gist"],
            proxy: true,
        },
        async function (accessToken, _refreshToken, profile, done) {
            const serializedData = {
                accessToken,
                displayName: profile.displayName,
                githubId: profile.username,
                profileUrl: profile.profileUrl,
                photos: profile.photos,
            }

            const foundUser = await UserModel.findOne({
                githubId: serializedData.githubId,
            })

            if (foundUser) {
                done(null, foundUser)
            } else {
                const newUser = await UserModel.create({
                    accessToken: serializedData.accessToken,
                    displayName: serializedData.displayName,
                    githubId: serializedData.githubId,
                    photos: serializedData.photos,
                    profileUrl: serializedData.profileUrl,
                })
                done(null, newUser)
            }
        },
    ),
)

export default passport
