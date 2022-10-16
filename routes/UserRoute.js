import express from "express";
import {getUsers, getUserById, createUser,updateUser,deleteUser} from "../controllers/UserController.js"
// import {vToken} from "../middleware/VerifyToken.js" //utk verifikasi endpoint yg tidak dapat diakses jika tidak login
import {vSession} from "../middleware/VerifySession.js" 

const router = express.Router()

router.get('/users', vSession, getUsers)
router.get('/users/:id',vSession, getUserById)
router.post('/users',vSession, createUser)
router.patch('/users/:id',vSession, updateUser)
router.delete('/users/:id',vSession, deleteUser)


export default router;