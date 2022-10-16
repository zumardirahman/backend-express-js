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

    if (!user) return res.status(404).json({ msg: "User not found!" });

    //cek kecocokan password
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password!" });

    //jika cocok construct user id,name,email
    const userId = user[0].id;
    const uuid = user[0].uuid;
    const name = user[0].name;
    const gender = user[0].gender;
    const email = user[0].email;
    const role = user[0].role;

    //buat session (optional)
    req.session.userId = uuid;
    // res.status(200).json({ uuid,name,gender,email,role });

    //
    const accessToken = jwt.sign(
      { userId, uuid, name, gender, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { userId, uuid, name, gender, email, role },
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
    // res.json({ accessToken });
    res.status(200).json({ uuid, name, email, role, accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email not found" });
  }
};



//fungsi untuk get user login berguna pada frontend
export const Me = async (req, res) => {
  if(!req.session.userId){
    return  res.status(401).json({msg: "mohon login ke akun anda"})
  }

  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "gender", "role"],
    where: {
      uuid: req.session.userId,
    },
  })
  if (!user) return res.status(404).json({ msg: "User not found!" });
  res.status(200).json(user)
}


export const logout = async (req, res) => {

  //hapus session (optional)
  req.session.destroy((err)=>{
    if(err) return res.status(400).json({msg: "Tidak dapat logout"})
    // res.status(200).json({msg:"anda telah logout"})
  }) 

  //ambil value token yang di set di cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204); //204 = no content
  const user = await User.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });

  //jika token tidak cocok antara database dengan yg dikirm klien
  if (!user[0]) return res.sendStatus(204);
  //jika cocok construct user id,name,email
  const userId = user[0].id;

  //update refresh token yang ada di db manejadi null ketika logout
  //simpan refresh token ke database
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  //hapus cookie
  res.clearCookie("refreshToken");

  return res.status(200).json({msg : "anda telah logout"});
};

export const register = async (req, res) => {
  const { name, email, gender, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
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
