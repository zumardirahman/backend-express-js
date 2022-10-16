import User from "../models/UserModel.js";

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

//maka kita tinggal ketik verifyUser pada setiap endpoint