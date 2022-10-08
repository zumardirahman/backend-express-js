import express from "express";
import cors from "cors";


const app=express();

//middelware
app.use(cors());
//express json
app.use(express.json());

//server run
app.listen(5000, ()=> console.log(`server berjalan....`));

//install nodemon secar global untuk 