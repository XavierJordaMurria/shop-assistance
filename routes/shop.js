const express = require('express');
const ShopController = require('../controllers/shop');
const router = express.Router();

router.get('/cart', ShopController.getCart);

router.get('/products', ShopController.getProducts);

router.get('/checkout', ShopController.getCheckout);

router.get('/', ShopController.getIndex);

module.exports = router;