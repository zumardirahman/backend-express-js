import express from "express";
import FileUpload from "express-fileupload"; //depedencies upload data
import cors from "cors"; //ini digunakan untuk agar API dapat di askes dari luar domain
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


//config
dotenv.config()

//table data
import loginRoute from "./routes/LoginRoute.js";
import userRoute from "./routes/UserRoute.js";
import productRoute from "./routes/ProductRoute.js";


const app=express();

//as middelware 
app.use(cors({credential:true, origin:'http://localhost:3000'})); //cred : agar klien mengirim credendsial //origin : domain untuk dapat mengskses API
app.use(cookieParser()); //ini digunakan utk membuat refresh token agar setiap  token expire tidak perlu login lagi

//express json
app.use(express.json());

//file upload fungsi
app.use(FileUpload());

//static file
app.use(express.static("public"));

//fungsi routes
app.use(loginRoute);
app.use(userRoute);
app.use(productRoute);

//server run
app.listen(5000, ()=> console.log(`server berjalan....`));

//install nodemon secar global untuk 