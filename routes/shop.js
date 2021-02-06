const express = require('express');
const ShopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middelware/is-auth');

router.get('/cart', isAuth, ShopController.getCart);

router.post('/cart', isAuth, ShopController.postCart);

router.get('/orders', isAuth, ShopController.getOrders);

router.post('/create-order', isAuth, ShopController.postOrders)

router.get('/', ShopController.getIndex);

router.get('/products', ShopController.getProducts);

router.get('/products/:productId', ShopController.getProductsById);

router.get('/checkout', isAuth, ShopController.getCheckout);

router.post('/cart-delete-item', isAuth, ShopController.postCartDeleteProduct);


module.exports = router;