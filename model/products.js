var cloudinary = require('./cloudinaryConfig');
const pool = require('./databaseConfig')

let productDB = {
    //Get product by id
    getProductById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from products where product_id = ?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },

    //Get product by id + stock
    getProductStockById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `
                    Select p.product_id, psc.psubcat_name, pc.pcat_name, p.product_name, p.product_desc, p.product_img, s.stock_id, s.stock_size, s.stock_price, p.created_at
                    from products p, stock s, product_category pc, product_subcategory psc
                    where p.product_id=? and p.product_id=s.product_id and pc.pcat_id=p.pcat_id and psc.psubcat_id=p.psubcat_id`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },

    //Get product by product name
    getProductByName: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from products where product_name = ?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },

    //Get all products
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from products`
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error)
                }
                console.log(result.length)
                return resolve(result)
            })
        })
    },

    //Get all product + stock
    getAllProductStock: () => {
        return new Promise((resolve, reject) => {
            let sql = `select a.* from(
                select p.*, s.stock_id, s.stock_size, s.stock_price, dense_rank() over (
                partition by p.product_id order by s.stock_price asc) r
                from products p, stock s
                where p.product_id=s.product_id) a
                where a.r=1`
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error)
                }
                console.log(result.length)
                return resolve(result)
            })
        })
    },

    //Get product by category
    getProductByCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `select a.* from(
                select p.*, s.stock_id, s.stock_size, s.stock_price, dense_rank() over (
                partition by p.product_id order by s.stock_price asc) r
                from products p, stock s
                where p.product_id=s.product_id and p.pcat_id=?) a
                where a.r=1`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },

    //Get product by sub category
    getProductBySubCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `select a.* from(
                select p.*, s.stock_id, s.stock_size, s.stock_price, dense_rank() over (
                partition by p.product_id order by s.stock_price asc) r
                from products p, stock s
                where p.product_id=s.product_id and p.psubcat_id=?) a
                where a.r=1`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                ;
                return resolve(result)
            })
        })
    },

    //Get product_id of last inserted product(As part of addProduct)
    getIdOfLastInsertedProduct: () => {
        return new Promise((resolve, reject) => {
            let sql = `select product_id from products order by 1 desc limit 1`
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product id
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },

    //Insert into stock table(As part of addProduct)
    addStock: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into stock (product_id, stock_size, stock_price) values (?,?,?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Insert into products table
    //So the process is insert data into products tables first
    //Then get the product id of the product you just inserted
    //Then insert data into stocks table using the product id you just got from the last inserted product
    addProduct: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into products (pcat_id, psubcat_id, product_name, product_desc, product_img, admin_name) values
            (?,?,?,?,?,?)`
            pool.query(sql, values.slice(0, 6), (error, result) => {
                if (error) {
                    return reject(error)
                }
                //Get product id of last inserted product
                productDB.getIdOfLastInsertedProduct()
                    .then((result2) => {
                        lastInsertedId = result2[0].product_id
                        newValues = values.slice(6.8)
                        newValues.unshift(lastInsertedId)
                        console.log(newValues)
                        //Using the product id we just got, call the function to insert data into stock
                        //based on the length of stock_size and stock_price
                        //(Need to implement validation to ensure stock_size length is the same as stock_price length)
                        for (let i = 0; i < newValues[2].length; i++) {
                            productDB.addStock([newValues[0], newValues[1][i], newValues[2][i]])
                        }
                    })
                    .catch((error2) => {
                        console.log(error2)
                        return reject(error2)
                    })
                    ;
                return resolve(result)
            })
        })
    },

    //Update product by product id
    updateProductById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update products set pcat_id=?, psubcat_id=?, product_name=?, product_desc=?,  
            product_img=?, admin_name=?, updated_at=now() where product_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update stock by stock id
    updateStockById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update stock set stock_size=?, stock_price=? where stock_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete product by product id
    deleteProductById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            //Delete from stock table first, then delete from products table to prevent foreign key constraint error
            let sql = `delete from stock where product_id = ?; delete from products where product_id = ?`
            pool.query(sql, [values, values], (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get product category by id
    getProductCategorybyID: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from product_category where pcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get all product categories
    getAllProductCategories: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from product_category`
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Create new product category
    addProductCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into product_category (pcat_name) values (?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update product category
    updateProductCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update product_category set pcat_name=? where pcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete product category
    deleteProductCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from product_category where pcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get all product sub categories
    getAllProductSubCategories: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from product_subcategory`
            pool.query(sql, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get product subcategory by id
    getProductSubCategorybyID: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from product_subcategory where psubcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get product subcategories by category id
    getProductSubCategoriesbyCatID: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from product_subcategory where pcat_id = ?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find product
                    return reject(404);
                }
                console.log(result);
                return resolve(result)
            })
        })
    },

    //Add new product subcategory
    addProductSubCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into product_subcategory (pcat_id, psubcat_name) values (?,?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update product subcategory
    updateProductSubCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update product_subcategory set pcat_id=?, psubcat_name=? where psubcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete product subcategory
    deleteProductSubCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from product_subcategory where psubcat_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete product size by stock id
    deleteProductSizeById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `delete from stock where stock_id = ?`
            pool.query(sql, [values, values], (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },
}



uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        console.log(`Trying to upload images`)
        file = file.file
        file = file.slice(12)
        console.log('File after slicing', file)
        cloudinary.uploader.upload(file, { resource_type: 'raw', upload_preset: 'upload_to_proposals' })
            .then((result) => {
                console.log(file)
                let data = { fileUrl: result.url, publicId: result.public_id, operationStatus: 'success' };
                const output = {
                    operationStatus: 'success',
                    description: 'Saved the file at Cloudinary',
                    content: data
                };
                resolve(output);
            })
            .catch((error) => {
                console.log('err '+file)
                console.log(error);
                const output = {
                    operationStatus: 'fail',
                    description: error,
                    content: { fileUrl: '', publicId: '' }
                };
                reject(output);
                return;
            })
    })
}

module.exports = {
    productDB,
    uploadImage
}
