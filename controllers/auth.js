const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendgridTrans = require('nodemailer-sendgrid-transport');
const sendGridCredentials = require('../sendgrid-credentials');
const { validationResult } = require('express-validator');


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
        errorMessage: msg,
        oldInput: { email: "", password: "" },
        validationErrors: [] 
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
        errorMessage: msg,
        oldInput: { email: "", password: "", condifmPassword: "" },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('here')
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password },  
            validationErrors: errors.array()
        });;
    }
    User.findOne({ email })
        .then(user => {
            if (!user) {

                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'login',
                    errorMessage: 'Invalid email or password',
                    oldInput: { email: email, password: password },  
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');;
                        });
                    }

                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'login',
                        errorMessage: 'Invalid email or password',
                        oldInput: { email: email, password: password },  
                        validationErrors: errors.array()
                    });

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, condifmPassword: req.body.confirmPassword },  
            validationErrors: errors.array()
        });;
    }
    bcrypt.hash(password, 12)
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
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let msg = req.flash('error');

    if (msg.length >= 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: msg
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (e, b) => {
        if (e) {
            console.error8(e);
            return res.redirect("/reset");
        }

        const token = b.toString('hex');

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash('error', `No account found for this email ${req.body.email}`);
                    return res.redirect('/reset');
                }
                const now = Date.now();
                const pluseOne = now + 3600000;
                user.resetToken = token;
                user.resetTokenExpiration = pluseOne;
                return user.save();
            })
            .then(result => {
                res.redirect("/");
                return transporter.sendMail({
                    to: req.body.email,
                    from: sendGridCredentials.senderEmail,
                    subject: "Password reset",
                    html: `
                <p>You requested a password reset</p>
                <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set new password</p>
                `
                });
            })
            .catch(e => console.error(e));
    });
};


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', `No user found for this token`);
                return res.redirect('/reset');
            }

            let msg = req.flash('error');

            if (msg.length >= 0) {
                msg = msg[0];
            }
            else {
                msg = null;
            }

            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: msg,
                userId: user._id.toString(),
                passwordToken: user.resetToken
            });
        })
        .catch(e => console.error(e));
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    console.log(passwordToken);
    console.log(Date.now());
    console.log(userId);

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then((user) => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashPass => {
            if (!resetUser) {
                req.flash('error', `No user found for this token`);
                return res.redirect('/reset');
            }
            resetUser.password = hashPass;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;

            return resetUser.save();
        })
        .then(() => {
            res.redirect('/login');
        })
        .catch(e => console.error(e));
}
