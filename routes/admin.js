const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middelware/is-auth');
const { body } = require('express-validator');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post("/add-product",
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({ min: 5, max: 200 }).trim(),
    ],
    isAuth, adminController.postAddProduct);
router.post('/edit-product',
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({ min: 5, max: 200 }).trim(),
    ],
    isAuth,
    adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;