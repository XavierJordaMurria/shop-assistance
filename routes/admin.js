const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middelware/is-auth');
const { body } = require('express-validator');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post("/add-product",
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('price').isFloat(),
        body('description').isLength({ min: 5, max: 200 }).trim(),
    ],
    isAuth, adminController.postAddProduct);
router.post('/edit-product',
    [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('price').isFloat(),
        body('description').isLength({ min: 5, max: 200 }).trim(),
    ],
    isAuth,
    adminController.postEditProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.get('/products', isAuth, adminController.getProducts);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;