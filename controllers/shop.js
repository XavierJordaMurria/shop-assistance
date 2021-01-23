const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/shop/products'
        });
    });
};

exports.getProductsById = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product)=> {
        console.log(product)
    });
    res.redirect('/shop');
};


exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/shop'
        });
    });
};

exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/cart', {
            prods: products,
            pageTitle: 'MyCart',
            path: '/shop/cart'
        });
    });
};

exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Orders',
            path: '/shop/orders'
        });
    });
};

exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/shop/checkout'
        });
    });
};