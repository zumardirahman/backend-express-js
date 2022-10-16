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