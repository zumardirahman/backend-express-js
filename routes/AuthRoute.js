import express from "express";
import {login, register, logout, Me} from "../controllers/Auth.js"
import { refreshToken } from "../controllers/RefreshTokenCon.js";

const router = express.Router()

//ketika token expire makan tidak perlu login lagi, dan hanya perlu memanggil end poit ini untuk refresh tokennya
router.get('/token',refreshToken)

router.get('/me',Me)

router.post('/login',login)

router.post('/register',register)

router.delete('/logout',logout)

export default router;