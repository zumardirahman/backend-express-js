import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    //cek kecocokan password
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password!" });

    //jika cocok construct user id,name,email
    const userId = user[0].id;
    const name = user[0].name;
    const gender = user[0].gender;
    const email = user[0].email;

    //
    const accessToken = jwt.sign(
      { userId, name, gender, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, name, gender, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    //simpan refresh token ke database
    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );

    //setelah refresh token tersimpan lalu http only cookie yang akan dikirim ke klien
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); //jika menggunakan http maka tambahkan secure : true

    //kirim respon ke klien acces token
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
};

export const register = async (req, res) => {
  const { name, email, gender, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      name: name,
      gender: gender,
      email: email,
      password: hashPassword,
    });
    res.status(201).json({ msg: "Registered Succesfully" });
  } catch (error) {
    console.log(error.message);
  }
};
