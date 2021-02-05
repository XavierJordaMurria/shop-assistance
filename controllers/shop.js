const Product = require('../models/product');
const Order = require('../models/orders');
const orders = require('../models/orders');


exports.getProducts = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/shop/products',
                isAuthenticated: req.isLoggedIn
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
                path: '/shop/products',
                isAuthenticated: req.isLoggedIn
            });
        });
};


exports.getIndex = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/shop',
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(e => console.error(e));
};

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.isLoggedIn
            });
        })
        .catch(e => console.error(e));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId)
        .then((product) => {
            console.log(product)
            if (product) {
                req.user.addToCart(prodId, product.price)
                    .then((response) => {
                        res.redirect('/shop/cart')
                    })
                    .catch(e => {
                        console.error(e)
                    })
            }
        });
};

exports.getOrders = (req, res, next) => {
    orders.find({'user.userId': req.user._id})
        .then((orders) => {
            res.render('shop/orders', {
                orders: orders,
                pageTitle: 'YourOrders',
                path: '/shop/orders',
                isAuthenticated: req.isLoggedIn
            });
        });
};

exports.postOrders = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, productData: { ...i.productId._doc } };
            });

            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products

            });

            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(e => console.error(e));
}

exports.getCheckout = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/checkout', {
                prods: products,
                pageTitle: 'Checkout',
                path: '/shop/checkout',
                isAuthenticated: req.isLoggedIn
            });
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(response => {
            res.redirect('/shop/cart');
        })
        .catch(e => console.error(e));
};
