const express = require('express');
const ShopController = require('../controllers/shop');
const router = express.Router();

router.get('/cart', ShopController.getCart);

router.post('/cart', ShopController.postCart);

router.get('/orders', ShopController.getOrders);

router.get('/', ShopController.getIndex);

router.get('/products', ShopController.getProducts);

router.get('/products/:productId', ShopController.getProductsById);

router.get('/checkout', ShopController.getCheckout);


module.exports = router;