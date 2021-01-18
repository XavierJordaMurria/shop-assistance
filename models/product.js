const fs = require('fs');
const path = require('path');

module.exports = class Product {
    static filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

    constructor(title) {
        this.title = title;
    }

    save() {
        
        products.push(this);

        fs.readFile(Product.filePath, (error, fileContent) => {
            let products = [];
            if(error) {
                console.error(`err:${error}`);
            }
            else {
                products = JSON.parse(fileContent);
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error) => {
                    console.error(error);
                });
            }
        });
    }

    static fetchAll() {
        fs.readFile(Product.filePath, (error, fileContent) => {
            if(error) {
                return []
            }
            
            return JSON.parse(fileContent);
        });
    }
}