const Product = require('../models/product');
const Order = require('../models/orders');
const orders = require('../models/orders');

exports.getLogin = (req, res, next) => {
    const isLoggedIn = req
    .get('Cookie')
    .split(';')[0]
    .trim()
    .split('=')[1];
    console.log(`isLogged: ${isLoggedIn}`);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true')
    res.redirect('/shop');
};
