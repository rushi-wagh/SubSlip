import express from "express"
import { allocateTeacher, getTeachers, teacherForClass, teacherForSubjects } from "../controllers/teacher.controllers.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"
const router = express.Router() 

router.get("/",isLoggedIn,getTeachers)
router.post("/allocate/:teacherId",isLoggedIn,allocateTeacher)
router.get("/class-teachers",isLoggedIn,teacherForClass)
router.get("/get-subject-teacher",isLoggedIn,teacherForSubjects)

export default router