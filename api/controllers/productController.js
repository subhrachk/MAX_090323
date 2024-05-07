const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require('../../middleware/check-auth');
const fs = require('fs')

const products = express.Router();

const Product = require("../models/product");

//const getProducts =  async (req,res,next) => {
//  Product.find()
//    .select("name price _id productImage")
//    .exec()
//    .then((docs) => {
//      const response = {
//        count: docs.length,
//        products: docs.map((doc) => {
//          return {
//            name: doc.name,
//            price: doc.price,
//            image : doc.productImage,
//            id: doc._id,
//            request: {
//              method: "GET",
//              url: "http://localhost:3000/products/" + doc._id,
//            },
//          };
//        }),
//      };
//      res.status(200).json(response);
//    })
//    .catch((err) => {
//      console.log(err);
//      res.status(200).json({ error: err });
//    });
//};

const getProducts =  async (req,res,next) => {
  Product.find()
    .select("name price productImage")
    .exec()
    .then((docs) => {
      const response = {
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price
          };
        }),
      };
      res.status(200).json(response.products);
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json({ error: err });
    });
};


const getProductById = (req,res,next,productId) => {
Product.findById(productId)
.select("name price _id productImage")
.exec()
.then((doc) => {
  console.log("From database", doc);
  if (doc) {
    res.status(200).json({
      product: doc,
      price : doc.price,
      image : doc.productImage,
      request: {
        type: "GET",
        url: "http://localhost:3000/products",
      },
    });
  } else {
    res
      .status(404)
      .json({ message: "No valid entry found for provided ID" });
  }
});
}

const saveProduct = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage : req.file.path,
      });
    product
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
              name: result.name,
              price: result.price,
              //image : result.productImage,
              //_id: result._id,
              //request: {
              //  type: "GET",
              //  url: "http://localhost:3000/products/" + result._id,
              //},
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
};

const updateProduct = (req,res,next, productId) => {
  const id = productId;
  console.log(id);
  //console.log(getProductById(req,res,next,productId));
  Product.findById(productId)
  .exec()
  .then(res => {
    fs.unlink(res.productImage, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    });
  const product = new Product({
    _id: id,
    name: req.body.name,
    price: req.body.price,
    productImage : req.file.path,
  });

  Product.findByIdAndUpdate({_id : id} , { $set : product })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

const deleteProduct = (req,res,next, productId) => {
    const id = productId;
    Product.findByIdAndDelete({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Product deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/products",
            body: { name: "String", price: "Number" },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
}

module.exports = {getProducts,getProductById,saveProduct, updateProduct, deleteProduct};
