const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddproduct = (req, res) => {
    const product = new Product(req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save();
    res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
    const editMode = Boolean(req.query.edit);
    console.log(`EditProduct with editMode: ${editMode}`)

    if (!editMode) {
        return res.redirect('/shop');
    }

    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        if (!product) {
            console.error(`No product for id:${prodId}`);
            return res.redirect('/shop');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });

};

