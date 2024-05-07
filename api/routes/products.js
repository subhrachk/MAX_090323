const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require('../../middleware/check-auth');

const products = express.Router();
const productController = require('../controllers/productController');

const storage = multer.diskStorage({
  //where to store file
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  //name format of stored file
  filename: function (req, file, cb) {
    //cb(null, new Date().toISOString() + file.originalname);
    const newdate =
      new Date().getDate().toString() +
      new Date().getMonth().toString() +
      new Date().getFullYear().toString();
    cb(null, newdate + new Date().getTime() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file if file type is not jpeg or png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//limit the size of the file here it is 5MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Product = require("../models/product");

//products.get("/", checkAuth, (req, res, next) => {
products.get("/", (req, res, next) => {
    productController.getProducts(req,res,next);
});

products.get("/:productId", checkAuth, (req, res, next) => {
    productController.getProductById(req,res,next,req.params.productId);
});

//products.post("/", checkAuth, upload.single('productImage') , (req, res, next) => {
products.post("/", upload.single('productImage') , (req, res, next) => {
    console.log(req.body);
    productController.saveProduct(req, res, next);
});

products.patch("/:productId", upload.single('productImage'),checkAuth, (req, res, next) => {
    productController.updateProduct(req,res,next,req.params.productId);
});

products.delete("/:productId", checkAuth, (req, res, next) => {
    productController.deleteProduct(req,res,next,req.params.productId);
});

module.exports = products;
