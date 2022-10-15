import express from "express";
import {getUsers, getUserById, createUser,updateUser,deleteUser} from "../controllers/UserController.js"
import {verifyToken} from "../middleware/VerifyToken.js" //utk verifikasi endpoint yg tidak dapat diakses jika tidak login

const router = express.Router()

router.get('/users',verifyToken, getUsers)
router.get('/users/:id',verifyToken,getUserById)
router.post('/users',verifyToken,createUser)
router.patch('/users/:id',verifyToken,updateUser)
router.delete('/users/:id',verifyToken,deleteUser)


export default router;