import express from "express"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import { changeRole } from "../controllers/admin.controllers.js"

const router = express.Router()
router.post('/change-role',isLoggedIn,changeRole)

export default router 