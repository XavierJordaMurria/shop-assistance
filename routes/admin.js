const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');

router.get('/add-product', ProductsController.getAddProduct);
router.post("/add-product", ProductsController.postAddproduct);

module.exports = router;