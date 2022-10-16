import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";


export const vToken = async (req, res, next) => {

  const authHeader = req.headers['authorization']; //mengambil header
  const token = authHeader && authHeader.split(' ')[1] //mengambil token //split dengan spasi krna dipisah spasi token dan barrelnya

  if(token == null) return res.sendStatus(401); //menggunakan send status krna tidak ingin mengirim pesan lagi

  //verifikasi token jika dapat tokennya
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=> { //params ke 3 adalah callback ddimana membawa 2 param err decoded(hasil)
      if(err) return res.sendStatus(403) //forbidden
      req.email = decoded.email //variabel untuk digunakan nantinya
      next()
  })

};

export const vSession = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "mohon login ke akun anda" });
  }

  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found!" });

  //variabel ini dapat digunakan pada setiap controller
  req.userId = user.id
  req.role = user.role
  next()
};

export const vAdminOnly = async (req, res, next) => {
  
  const user = await User.findOne({
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found!" });
  if (user.role !== "admin") return res.status(403).json({ msg: "Akses Terlarang!" });

  next()
};

//maka kita tinggal ketik verifyUser pada setiap endpoint