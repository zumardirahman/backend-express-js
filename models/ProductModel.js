import { Sequelize } from "sequelize";
import db from "../config/database.js";

const {DataTypes}   = Sequelize;

const Product = db.define('products',{
    name : DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
},{
    freezeTableName:true
})

export default Product;

//fungsi genegerate tabel tidak ada di database

(async()=>{
    await db.sync()
})();
