import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
}))

app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(express.static("public"))


import userRoutes from "./routes/user.routes.js"

app.use("/api/v1/users", userRoutes)



export {app}
