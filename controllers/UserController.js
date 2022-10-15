import User from "../models/UserModel.js";
import bcrypt from "bcrypt"



export const register = async (req, res) => {
  const {name, email, gender, password, confPassword} = req.body
  if(password !== confPassword) return res.status(400).json({msg: "Password dan confirm password tidak cocok"})
 
  const salt=await bcrypt.genSalt()
  const hashPassword= await bcrypt.hash(password, salt)
   
  try {
    await User.create({
      name : name,
      gender : gender,
      email: email,
      password:hashPassword 
    })
    res.status(201).json({msg: "Registered Succesfully"});

  } catch (error) {
    console.log(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserById = async (req, res) => {
    try {
      const response = await User.findOne({
        where:{
            id:req.params.id
        }
      });
      res.status(200).json(response);
    } catch (error) {
      console.log(error.message);
    }
  };
  

export const createUser = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
    try {
      await User.create(req.body)
      res.status(201).json({msg: "User Created"});
    } catch (error) {
      console.log(error.message);
    }
  };
  

export const updateUser = async (req, res) => {
    try {
      await User.update(req.body,{
        where:{
            id: req.params.id
        }
      })
      res.status(200).json({msg: "User Updated"});
    } catch (error) {
      console.log(error.message);
    }
  };
  
export const deleteUser = async (req, res) => {
    try {
      await User.destroy({
        where:{
            id: req.params.id
        }
      })
      res.status(200).json({msg: "User Deleted"});
    } catch (error) {
      console.log(error.message);
    }
  };