const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const ordersController = require('../controllers/orders');

router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', checkAuth, ordersController.orders_create);

router.get('/:orderId', checkAuth, ordersController.orders_get_order);

router.delete('/:orderId', checkAuth, ordersController.orders_delete_order);

module.exports = router;