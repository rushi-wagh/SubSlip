import express from "express"
import { getStudents, getStudentsByBatch, getStudentsByClass, getVerifiedStudents, postStudents, updateVerificationStatus } from "../controllers/students.controllers.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()
router.post('/',isLoggedIn,postStudents)
router.get('/',isLoggedIn,getStudents)
router.post('/by-class',isLoggedIn,getStudentsByClass)
router.post('/by-batch',isLoggedIn,getStudentsByBatch)
router.post('/update/:studentId',isLoggedIn,updateVerificationStatus)
router.get('/verified',isLoggedIn,getVerifiedStudents)

export default router