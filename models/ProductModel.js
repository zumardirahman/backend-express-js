import { Sequelize } from "sequelize";
import db from "../config/database.js";

//membuat asosiasi user
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Product = db.define(
  "products",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      //relasi dengan user
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

//relasi one to many = 1 user bisa input banyak priduct
User.hasMany(Product)
Product.belongsTo(User, {foreignKey: 'userId'})

export default Product;

//fungsi genegerate tabel tidak ada di database

(async () => {
  await db.sync();
})();
