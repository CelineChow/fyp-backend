const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const productDB = require('../model/products');
const product = productDB.productDB

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions

//Get product by product id
app.get('/productbyid/:product_id', (req, res) => {
    const data = {
        product_id: req.params.product_id
    };
    product.getProductById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Product not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get product by product name
app.get('/productbyname/:product_name', (req, res) => {
    const data = {
        product_name: req.params.product_name
    };
    product.getProductByName(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Product not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get all products
app.get('/product', (req, res) => {
    product.getAllProducts()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get all product + stock
app.get('/productStock', (req, res) => {
    product.getAllProductStock()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get product by product category
app.get('/productbycategory/:pcat_id', (req, res) => {
    const data = {
        pcat_id: req.params.pcat_id
    };
    product.getProductByCategory(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Product not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get product by product subcategory
app.get('/productbysubcategory/:psubcat_id', (req, res) => {
    const data = {
        psubcat_id: req.params.psubcat_id
    };
    product.getProductBySubCategory(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Product not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get stock by product id
app.get('/stockbyid/:product_id', (req, res) => {
    const data = {
        product_id: req.params.product_id
    };
    product.getProductStockById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Product not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Add product
app.post('/product', check.hasPermission(action.CREATE_PRODUCTS), (req, res) => {
    const data = {
        pcat_id: req.body.pcat_id,
        psubcat_id: req.body.psubcat_id,
        product_name: req.body.product_name,
        product_desc: req.body.product_desc,
        product_img: req.body.product_img,
        admin_name: req.body.admin_name,
        stock_sizes: req.body.stock_sizes,
        stock_prices: req.body.stock_prices
    }
    console.log(data)
    product.addProduct(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Update product by product_id
app.put('/product', check.hasPermission(action.EDIT_PRODUCTS), (req, res) => {
    const data = {
        pcat_id: req.body.pcat_id,
        psubcat_id: req.body.psubcat_id,
        product_name: req.body.product_name,
        product_desc: req.body.product_desc,
        product_img: req.body.product_img,
        admin_name: req.body.admin_name,
        product_id: req.body.product_id
    }
    //console.log(data)
    product.updateProductById(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Update stock by stock_id
app.put('/stock', check.hasPermission(action.EDIT_PRODUCTS), (req, res) => {
    const data = {
        stock_size: req.body.stock_size,
        stock_price: req.body.stock_price,
        stock_id: req.body.stock_id
    }
    //console.log(data)
    product.updateStockById(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Update stock by stock_id
app.post('/stock', check.hasPermission(action.EDIT_PRODUCTS), (req, res) => {
    const data = {
        product_id: req.body.product_id,
        stock_size: req.body.stock_size,
        stock_price: req.body.stock_price
    }
    //console.log(data)
    product.addStock(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Delete product by product_id
app.delete('/product', check.hasPermission(action.DELETE_PRODUCTS), (req, res) => {
    const data = {
        product_id: req.body.product_id
    }
    product.deleteProductById(data)
        .then((result) => {
            console.log(`app.js ${result}`);
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Get all product categories
app.get('/productCategory', (req, res) => {
    product.getAllProductCategories()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get product category by category id
app.get('/productCategory/:pcat_id', (req, res) => {
    const data = {
        pcat_id: req.params.pcat_id
    };
    product.getProductCategorybyID(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

//Add product category
app.post('/productCategory', check.hasPermission(action.CREATE_PRODUCTS), (req, res) => {
    const data = {
        pcat_name: req.body.pcat_name
    }
    product.addProductCategory(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update product category
app.put('/productCategory/:pcat_id', check.hasPermission(action.EDIT_PRODUCTS), (req, res) => {
    const data = {
        pcat_name: req.body.pcat_name,
        pcat_id: req.params.pcat_id
    };
    product.updateProductCategory(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete product category
app.delete('/productCategory/:pcat_id', check.hasPermission(action.DELETE_PRODUCTS), (req, res) => {
    const data = {
        pcat_id: req.params.pcat_id
    }
    product.deleteProductCategory(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get all product subcategories
app.get('/productSubCategories', (req, res) => {
    product.getAllProductSubCategories()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get product subcategory by id
app.get('/productSubCategory/:psubcat_id', (req, res) => {
    const data = {
        psubcat_id: req.params.psubcat_id
    }
    product.getProductSubCategorybyID(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

//Get product subcategories by category id
app.get('/productSubCategories/:pcat_id', (req, res) => {
    const data = {
        pcat_id: req.params.pcat_id
    };
    product.getProductSubCategoriesbyCatID(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send("Product subcategory not found");
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Add product subcategory
app.post('/productSubCategory', check.hasPermission(action.CREATE_PRODUCTS), (req, res) => {
    const data = {
        pcat_id: req.body.pcat_id,
        psubcat_name: req.body.psubcat_name
    }
    product.addProductSubCategory(data)
        .then((result) => {
            res.status(201).send(result)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

//Update product subcategory
app.put('/productSubCategory/:psubcat_id', check.hasPermission(action.EDIT_PRODUCTS), (req, res) => {
    const data = {
        pcat_id: req.body.pcat_id,
        psubcat_name: req.body.psubcat_name,
        psubcat_id: req.params.psubcat_id
    }
    product.updateProductSubCategory(data)
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((err) => {
            res.status(500).send(err)
        })
})

//Delete product sub category
app.delete('/productSubCategory/:psubcat_id', check.hasPermission(action.DELETE_PRODUCTS), (req, res) => {
    const data = {
        psubcat_id: req.params.psubcat_id
    }
    product.deleteProductSubCategory(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete product sizes by stock id  
app.delete('/productSize', check.hasPermission(action.DELETE_PRODUCTS), (req, res) => {
    const data = {
        stock_id: req.body.stock_id
    }
    product.deleteProductSizeById(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Upload
app.post('/upload', (req, res) => {
    const data = {
        file: req.body.file
    }
    console.log(`UPLOAD DATA IS ${JSON.stringify(data)}`)
    console.log(`UPLOAD DATA FILE IS ${data.file}`)
    console.log(`UPLOAD DATA PATH IS ${data.file}`)
    productDB.uploadImage(data)
        .then((result) => {
            console.log(`upload: ${JSON.stringify(result)}`)
            res.status(200).send(result)
        })
        .catch((err) => {
            console.log(`upload: ${err}`)
            res.status(500).send(err)
        })
})

module.exports = app;