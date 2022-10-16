import express from "express";
import session from "express-session";
import FileUpload from "express-fileupload"; //depedencies upload data
import cors from "cors"; //ini digunakan untuk agar API dapat di askes dari luar domain
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import db from "../config/database.js"; //aktifkan saat syn table


//config
dotenv.config()

//table data
import loginRoute from "./routes/LoginRoute.js";
import userRoute from "./routes/UserRoute.js";
import productRoute from "./routes/ProductRoute.js";


const app=express();

//session
app.use(session({
    secret:process.env.SESS_SECRET,
    resave: false,
    saveUninitialized : true,
    cookie : {
        secure: 'auto', //pilih true kalo https
    }
}));

//as middelware 
const corsOptions ={
    origin:'http://localhost:3000', //domain yang kita izinkan untuk akses api
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions)); //cred : agar klien mengirim credendsial //origin : domain untuk dapat mengskses API

app.use(cookieParser()); //ini digunakan utk membuat refresh token agar setiap  token expire tidak perlu login lagi

//express json
app.use(express.json()); // menerima data dalam format json

//file upload fungsi
app.use(FileUpload());

//static file
app.use(express.static("public"));

//fungsi routes
app.use(loginRoute);
app.use(userRoute);
app.use(productRoute);

//sync untuk generate table
// aktifkan ini jika tidak ada table
// (async () => {
//   await db.sync();
// })();

//server run
app.listen(process.env.APP_PORT, ()=> console.log(`server berjalan....`));

//install nodemon secar global untuk 