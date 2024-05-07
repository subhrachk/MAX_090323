const express = require('express');
const bodyParser = require('body-parser');
const orders = require('./api/routes/orders');
const products = require('./api/routes/products');
const morgan = require('morgan');
const mongoose = require('mongoose');
const users = require('./api/routes/users');
const app = express();
const jwt = require("jsonwebtoken");
const cors = require('cors');

//app.use((req, res, next) => {
//res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
//res.header("Access-Control-Allow-Headers",
//"Origin, X-Requested-With, Content-Type, Accept, Authorization"
//);
//if (req.method === 'OPTIONS') {
//res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//return res.status(200).json({});
//}
//next();
//});

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/orders',orders);
app.use('/products',products);
app.use('/users',users);


mongoose.connect("mongodb://subhra:" +
				"Subhra$123" +
				"@127.0.0.1:27017/REST_API_MAX_090323")
                .then(console.log('Database Connected!'))
                .catch(err=>console.log(err));


//capturing error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//displaying error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;