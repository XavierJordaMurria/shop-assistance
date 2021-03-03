const express = require('express');
const ShopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middelware/is-auth');


router.get('/', ShopController.getIndex);

router.get('/products', ShopController.getProducts);

router.get('/products/:productId', ShopController.getProductsById);

router.get('/checkout', isAuth, ShopController.getCheckout);

router.get('/cart', isAuth, ShopController.getCart);

router.post('/cart', isAuth, ShopController.postCart);

router.post('/cart-delete-item', isAuth, ShopController.postCartDeleteProduct);

router.post('/create-order', isAuth, ShopController.postOrders)

router.get('/orders', isAuth, ShopController.getOrders);

router.get('/orders/:orderId', isAuth, ShopController.getInvoice);


module.exports = router;