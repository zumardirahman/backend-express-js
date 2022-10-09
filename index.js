import express from "express";
import FileUpload from "express-fileupload"; //depedencies upload data
import cors from "cors";

//table data
import userRoute from "./routes/UserRoute.js";
import productRoute from "./routes/ProductRoute.js";


const app=express();

//middelware
app.use(cors());

//express json
app.use(express.json());

//file upload fungsi
app.use(FileUpload());

//static file
app.use(express.static("public"));

//fungsi routes
app.use(userRoute);
app.use(productRoute);

//server run
app.listen(5000, ()=> console.log(`server berjalan....`));

//install nodemon secar global untuk 