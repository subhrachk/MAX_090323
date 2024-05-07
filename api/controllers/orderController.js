
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

const getAllOrder = async (req,res,next) => {
    Order.find()
      .select("product quantity _id")
      .populate('product',"name")
      .exec()
      .then((docs) => {
        console.log(docs);
        const response = {
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                method: "GET",
                url: "http://localhost:3000/orders/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({ error: err });
      });
}
  
  
 const getOrderById = (req, res, next, orderid) => {
    const id = orderid;
    Order.findById(id)
      .select("product quantity _id")
      .populate('product',"name")
      .exec()
      .then((doc) => {
        res.status(200).json({
          id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            method: "GET",
            url: "http://localhost:3000/orders/",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({ error: err });
      });
  };
  
 const saveOrder = (req, res, next) => {
    Product.findById(req.body.productId)
      .exec()
      .then((product) => {
        if (product) {
          const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: product,
            quantity: req.body.quantity,
          });
          order
            .save()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "Order created successfully",
                createdOrder: {
                  _id: result._id,
                  product: {
                    _id : product._id,
                    name : product.name,
                    price : product.price,
                    image : product.productImage
                  },
                  quantity: result.quantity,
                  request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id,
                  },
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };
  
const deleteOrder = (req, res, next, orderid ) => {
    Order.remove({ _id: orderid })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Order deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: { productId: "ID", quantity: "Number" },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  };

module.exports = {getAllOrder, getOrderById, saveOrder,deleteOrder}