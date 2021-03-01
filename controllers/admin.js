const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {

  if (!req.session.isLoggedIn) {
    res.redirect('/login');
  }

  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const error = validationResult(req);

  if (!image) {
    res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: 'Attached file it is not a valid image.',
      validationErrors: []
    });
  }

  if (!error.isEmpty()) {
    res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array()
    });
  }

  const imageUrl = image.path;
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
    .catch(e => {
      console.error(e)
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(e => {
      console.error(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });;
};

exports.postEditProduct = (req, res, next) => {
  console.log(`posting edit entry`)
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        price: updatedPrice,
        description: updatedDesc,
        title: updatedTitle,
        _id: prodId,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array()
    });
  }

  const updatedImageUrl = image.path;

  Product.findById(prodId)
    .then(p => {
      if (p.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      p.title = updatedTitle;
      p.price = updatedPrice;
      if (image) {
        p.imageUrl = image.path;
      }
      p.description = updatedDesc;

      return p.save()
        .then((response) => {
          console.log(`posting edit saved`)
          res.redirect('/admin/products');
        });
    }).catch(e => {
      console.error(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(res => {
      res.redirect('/admin/products');
    })
    .catch(e => {
      console.error(e);
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};
