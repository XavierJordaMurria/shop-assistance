const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddproduct = (req, res) => {
    const product = new Product(req.body.title)
    product.save();
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

