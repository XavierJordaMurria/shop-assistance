const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const Product = require('../models/product');
const Order = require('../models/orders');
const orders = require('../models/orders');
const { set } = require('mongoose');


exports.getProducts = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(e => {
            console.error(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
          });;
};

exports.getProductsById = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                pageTitle: `${product.title}`,
                path: '/products'
            });
        });
};


exports.getIndex = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(e => {
            console.error(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
          });;
};

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(e => {
            console.error(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
          });;
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
                        res.redirect('/cart')
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
                path: '/orders'
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
                    name: req.user.email,
                    email: req.user.email,
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
        .catch(e => {
            console.error(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
          });;
}

exports.getCheckout = (req, res, next) => {
    Product.find({})
        .then((products) => {
            res.render('shop/checkout', {
                prods: products,
                pageTitle: 'Checkout',
                path: '/checkout'
            });
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(response => {
            res.redirect('/cart');
        })
        .catch(e => {
            console.error(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
            return next(error);
          });;
};

exports.getInvoice = (req, res, next) => {
    console.log('Preparing invoice');
    const orderId = req.params.orderId;

    Order.findById(orderId)
    .then((order)=>{
        if (!order) {
            return next(new Error('No order found!'));
        }

        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorised user!'));
        }

        const invoiceName = `invoice-${orderId}.pdf`;
        const invoicePath = path.join('data', 'Invoices', invoiceName);
        console.log(`${invoicePath}`);
        // fs.readFile(invoicePath, (error, data) =>{
        //     if(error) {
        //         return next(error);
        //     }
    
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        //     res.send(data);
        // });

        const file = fs.createReadStream(invoicePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
        file.pipe(res);

    })
    .catch(e => next(e));


};
