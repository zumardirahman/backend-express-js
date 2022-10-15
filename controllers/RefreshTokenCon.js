import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";


export const refreshToken = async (req, res) => {

    try {
        //ambil value token yang di set di cookie
        const refreshToken = req.cookies.refreshToken 
        if(!refreshToken) return res.sendStatus(401)
        const user = await User.findAll({
            where : {
                refresh_token : refreshToken
            }
        })
        
        //jika token tidak cocok antara database dengan yg dikirm klien
        if(!user[0]) return res.sendStatus(403)

    //verifikasi token jika cocok
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=> { //params ke 3 adalah callback ddimana membawa 2 param err decoded(hasil)
            if(err) return res.sendStatus(403) //forbidden

            //ambil value dari user/database
            const userId    = user[0].id;
            const name      = user[0].name;
            const gender    = user[0].gender;
            const email     = user[0].email;
            
            //mebuat acces token baru
            const accessToken = jwt.sign(
                { userId, name, gender, email },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "15s",
                }
              );
            
              //kirimkan acces token ke klien
              res.json({ accessToken }); 
        })

      } catch (error) {
        console.log(error);
      }

  };