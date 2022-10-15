import express from "express";
import {login, register, logout} from "../controllers/LoginCon.js"
import { refreshToken } from "../controllers/RefreshTokenCon.js";

const router = express.Router()

//ketika token expire makan tidak perlu login lagi, dan hanya perlu memanggil end poit ini untuk refresh tokennya
router.get('/token',refreshToken)

router.post('/login',login)

router.post('/register',register)

router.delete('/logout',logout)

export default router;