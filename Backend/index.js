import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"   
import { connectDB } from "./src/utils/db.js"

const app = express()
dotenv.config()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser()) 
app.use(express.urlencoded({ extended: true })) 

connectDB().then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})