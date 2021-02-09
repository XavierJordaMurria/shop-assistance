const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then((userDoc) => {
                        if (userDoc) {
                            return Promise.reject('User email already exist, pick another one');
                        }
                        return true;
                    })
            }),
        body(
            'password',
            'Please enter a valid password with lenth >= 6'
        )
            .isLength({ min: 6 })
        ,
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords must match');
                }
                return true;
            })
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;