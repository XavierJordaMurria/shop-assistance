const User = require('../models/user');

exports.getLogIn = (req, res, next) => {
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

exports.postLogIn = (req, res, next) => {
      req.session.isLoggedIn = true;
      req.session.save((err) => {
          if (err) {
              console.error(err);
          }
          res.redirect('/shop');
      });
};

exports.postLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
        }
        res.redirect('/shop');
    });
};
