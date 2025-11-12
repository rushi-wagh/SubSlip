import express from "express"
import { login, registerUser } from "../controllers/users.controllers.js"

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',login)


export default router