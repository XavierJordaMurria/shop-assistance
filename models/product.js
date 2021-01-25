const fs = require('fs');
const path = require('path');
const cartModel = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {

      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        const updatedProduts = [...products];
        updatedProduts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduts), err => {
          if (err) {
            console.log(err);
          }
        });
      }
      else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  static delete(productId) {
    getProductsFromFile(products => {

      if (productId) {
        const product = products.find(p => p.id === productId);
        const updatedProduts = products.filer(p => p.id !== productId);
        fs.writeFile(p, JSON.stringify(updatedProduts), err => {
          if (!err) {
            cartModel.deleteProduct(productId, product.price);
          }
        });

      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const theProduct = products.find(e => e.id === id);
      cb(theProduct);
    });
  }
};