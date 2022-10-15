import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    name: { type: DataTypes.STRING },
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
  }
);

export default User;

//fungsi genegerate tabel tidak ada di database

// aktifkan ini jika tidak ada table
// (async () => {
//   await db.sync();
// })();
