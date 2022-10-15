import express from "express";
import {getUsers, getUserById, createUser,updateUser,deleteUser} from "../controllers/UserController.js"
import {verifyToken} from "../middleware/VerifyToken.js" //utk verifikasi endpoint yg tidak dapat diakses jika tidak login

const router = express.Router()

router.get('/users',verifyToken, getUsers)
router.get('/users/:id',getUserById)
router.post('/users',createUser)
router.patch('/users/:id',updateUser)
router.delete('/users/:id',deleteUser)


export default router;