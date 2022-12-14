import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import path from "path"; //mengambil extension
import fs from "fs"; //file system untuk menghapus file bawaan node js
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      //req.role didapat dari kiriman sesion pada middle ware
      response = await Product.findAll({
        attributes: ["uuid", "name", "price", "url"],
        include: [{ model: User, attributes: ["name", "email"] }],
      });
    } else if (req.role === "user") {
      response = await Product.findAll({
        attributes: ["uuid", "name", "price", "url"],
        where: {
          userId: req.userId,
        },
        include: [{ model: User, attributes: ["name", "email"] }],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if(!product) return  res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      //req.role didapat dari kiriman sesion pada middle ware
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          id: product.id,
        },
        include: [{ model: User, attributes: ["name", "email"] }],
      });
    } else if (req.role === "user") {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price"],
        where: {
          [Op.and]:[{id:product.id}, {userId: req.userId}],
        },
        include: [{ model: User, attributes: ["name", "email"] }],
      });
    }

    if(!response) return  res.status(404).json({ msg: "Data User tidak ditemukan" });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createProduct = (req, res) => {
  console.log(req.body);
  console.log(req.files);
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  //   console.log(req.files.file);
  const { name, price } = req.body;

  const file = req.files.file;

  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "invalid images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Product.create({
        name: name,
        price: price,
        userId: req.userId,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Product Created Succesfully" });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "No Data Found!" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "invalid images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    if (product.image) {
      const filepath = `./public/images/${product.image}`;
      fs.unlinkSync(filepath); //untuk hapus file di directory
    }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product Updated Succesfully" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "No Data Found!" });

  //delete data image di folder dan database
  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath); //untuk hapus file di directory

    await Product.destroy({
      where: {
        id: product.id,
      },
    });
    res.status(200).json({ msg: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
