const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendgridTrans = require('nodemailer-sendgrid-transport');
const sendGridCredentials = require('../sendgrid-credentials');

const transporter = nodeMailer.createTransport(sendgridTrans({
    auth: {
        api_key: sendGridCredentials.apiKey
    }
}));

exports.getLogin = (req, res, next) => {
    let msg = req.flash('error');

    if (msg.length >= 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: msg
    });
};

exports.getSignup = (req, res, next) => {
    let msg = req.flash('error');

    if (msg.length >= 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: msg
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt
            .compare(password, user.password)
            .then((doMatch)=>{
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');;
                    });
                }

                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');

            })
            .catch(e => {
                console.error(e);
                req.flash('error', `${e}`);
                return res.redirect('/login');
            });

        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const condifmPassword = req.body.condifmPassword;

    User.findOne({ email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash('error', 'User email already exist, pick another one');
                return res.redirect("/signup");
            }

            return bcrypt.hash(password, 12)
                .then(passHash => {
                    const user = new User({
                        email,
                        password: passHash,
                        cart: {
                            items: []
                        },
                        name: email
                    });

                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                    return transporter.sendMail({
                        to: email,
                        from: sendGridCredentials.senderEmail,
                        subject: "Successfully signed In for the AppShop",
                        html: "<h1>You successfully signed up!!</h1>"
                    });
                })
                .catch(e => console.error(`Error sending email: ${e}`));
        })
        .catch(e => console.error(e));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};
