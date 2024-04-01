import mongoose from "mongoose"

const MONGO_URI_USERNAME = process.env.MONGO_URI_USERNAME as string
const MONGO_URI_PASSWORD = process.env.MONGO_URI_PASSWORD as string
const DB_NAME = process.env.DB_NAME as string

export const mongoLocalURI = "mongodb://127.0.0.1:27017"
export const mongoAtlasURI = `mongodb+srv://${MONGO_URI_USERNAME}:${MONGO_URI_PASSWORD}@i7jcluster.rlfws.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
export const mongoURI = mongoAtlasURI

export const connectionOptions: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}
