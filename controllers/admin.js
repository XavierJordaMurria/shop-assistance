const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
  }

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user
  });
  product.save()
    .then(() => {
      res.redirect('/admin/products');

    })
    .catch(e => console.error(e));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  console.log(`posting edit entry`)
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const data = {
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  };

  Product.findById(prodId)
    .then(p => {
      p.title = updatedTitle;
      p.price = updatedPrice;
      p.imageUrl = updatedImageUrl;
      p.description = updatedDesc;

      p.save()
        .then((response) => {
          console.log(`posting edit saved`)
          res.redirect('/admin/products');
        })
        .catch(e => console.error(e));
    })

};

exports.getProducts = (req, res, next) => {
  Product.find({})
    .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(res => {
      res.redirect('/admin/products');
    })
    .catch(e => { console.error(e) });
};
