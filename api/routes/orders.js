const express = require("express");

const orders = express.Router();
const mongoose = require("mongoose");
// const Order = require("../models/order");
// const Product = require("../models/product");
const checkAuth = require('../../middleware/check-auth');
const orderController = require('../controllers/orderController');

orders.get("/", checkAuth, (req, res, next) => {
  orderController.getAllOrder(req,res,next);
});

orders.get("/:orderid", checkAuth, (req, res, next) => {
  orderController.getOrderById(req,res,next,req.params.orderid);
});

orders.post("/", checkAuth, (req, res, next) => {
  orderController.saveOrder(req,res,next);
});

orders.delete("/:orderid", checkAuth, (req, res, next) => {
  orderController.deleteOrder(req,res,next,req.params.orderid);
});

module.exports = orders;
