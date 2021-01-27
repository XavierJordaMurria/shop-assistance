const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/shop/products'
            });
        })
        .catch(e => console.error(e));
};

exports.getProductsById = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then((product) => {
        console.log(product);
        res.render('shop/product-detail', {
            product: product,
            pageTitle: `${product.title}`,
            path: '/shop/products'
        });
    });
};


exports.getIndex = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/shop'
            });
        })
        .catch(e => console.error(e));
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.find({})
            .then((products) => {
                const cartProducts = [];
                for (product of products) {
                    const cartProductData = cart.products.find(
                        prod => prod.id === product.id
                    );
                    if (cartProductData) {
                        cartProducts.push({ productData: product, qty: cartProductData.qty });
                    }
                }
                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: cartProducts
                });
            });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId)
    .then((product) => {
        console.log(product)
        if (product) {
            Cart.addProduct(prodId, product.price)
        }
    });
    res.redirect('/shop/cart')
};

exports.getOrders = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/orders', {
                prods: products,
                pageTitle: 'Orders',
                path: '/shop/orders'
            });
        });
};

exports.getCheckout = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/checkout', {
                prods: products,
                pageTitle: 'Checkout',
                path: '/shop/checkout'
            });
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/shop/cart');
    });
};
