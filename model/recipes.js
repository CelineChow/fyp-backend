const pool = require('./databaseConfig')
//Recipe
let recipeDB = {
    //Get recipe by id
    getRecipeById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes where recipe_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log("err: " + error);
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find recipe
                    //console.log("Recipes not found");
                    return reject(404);
                }
                resolve(result);
            })
        })
    },

    //Get recipe by name
    getRecipeByName: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes where recipe_name = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length != 1) {
                    //If cannot find recipe
                    return reject(404);
                }
                resolve(result);
            })
        })
    },

    //Get all recipes
    getAllRecipes: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Get recipe by recipe category
    getRecipeByCat: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes where rcat_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                console.log('This is here',result);
                resolve(result);
            })
        })

    },

    //Get recipe by recipe sub category
    getRecipeBySubCat: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipes where rsubcat_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                console.log(result);
                resolve(result);
            })
        })
    },

    //Add recipe
    createRecipe: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into recipes (rcat_id, recipe_name, prep_time, cooking_time, recipe_desc, recipe_img, recipe_step,
                    admin_name, visibility, visibility_start_date, visibility_end_date) values (?,?,?,?,?,?,?,?,?,?,?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update recipe by recipe id
    updateRecipebyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update recipes set rcat_id=?, recipe_name=?, prep_time=?, cooking_time=?, recipe_desc=?, recipe_img=?, 
                recipe_step=?, admin_name=?, visibility=?, visibility_start_date=?, visibility_end_date=?, updated_at=now() 
                where recipe_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete recipe
    deleteRecipebyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            //Delete recipe and all related recipe ingredients
            let sql = `delete from recipes where recipe_id=?`
            pool.query(sql, [values, values, values], (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Recipe categories
    //Get all recipe categories
    getAllRecipeCategories: () => {
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipe_category`;
            pool.query(sql, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Get recipe category by rcat_id
    getRecipeCategoryById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from recipe_category where rcat_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Add recipe category
    addRecipeCategory: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Insert into recipe_category (rcat_name) values (?)`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Update recipe category by rcat_id
    updateRecipeCategoryById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Update recipe_category set rcat_name = ? where rcat_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Delete recipe category by rcat_id
    deleteRecipeCategoryById: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Delete from recipe_category where rcat_id = ?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                resolve(result);
            })
        })
    },
}


let ingredientDB = {
    //Ingredients
    //Get ingredients by recipe id
    getIngredientsbyRecipeId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from ingredients where recipe_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Get ingredient by ingredient id
    getIngredientbyIngredientId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from ingredients where ingredient_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                console.log(result)
                resolve(result);
            })
        })
    },

    //Add ingredient
    addIngredient: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into ingredients (recipe_id,ingredient_name,ingredient_qty,optional) values (?,?,?,?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update ingredient by ingredient id
    updateIngredientbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update ingredients set recipe_id=?, ingredient_name=?, ingredient_qty=?, optional=? where ingredient_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete ingredient by id
    deleteIngredientbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            //Delete recipe and all related recipe ingredients
            let sql = `delete from ingredient_product where ingredient_id=?; delete from ingredients where ingredient_id=?`
            pool.query(sql, [values, values], (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Ingredient product
    //Get ingredient products by ingredient id
    getIngredientProdbyIngredientId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select ip.ingredientprod_id, ip.swap, i.ingredient_id, p.product_id, p.product_name, p.product_desc, 
            p.product_img, s.stock_id, s.stock_size, s.stock_price, r.recipe_id, r.recipe_img
            from products p, stock s, recipes r, ingredients i, ingredient_product ip
            where ip.ingredient_id=? and r.recipe_id = i.recipe_id  and i.ingredient_id = ip.ingredient_id and ip.stock_id = s.stock_id
            and s.product_id = p.product_id;`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Add ingredient product
    addIngredientProd: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `insert into ingredient_product (ingredient_id,recipe_id,stock_id,swap) values (?,?,?,?)`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Update ingredient product by ingredient product id
    updateIngredientProdbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `update ingredient_product set ingredient_id=?, recipe_id=?, stock_id=?, swap=? where ingredientprod_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Delete ingredient product by
    deleteIngredientProdbyId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            //Delete recipe and all related recipe ingredients
            let sql = `delete from ingredient_product where ingredientprod_id=?`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error)
                }
                return resolve(result)
            })
        })
    },

    //Get ingredient products by recipe id
    getIngredientProdbyRecipeId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `Select * from ingredient_product where recipe_id=?`;
            pool.query(sql, values, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            })
        })
    },

    //Get ingredient_product, ingredient, product, stock and recipe
    getIngredientProductStockByRecipeId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `
            Select ip.ingredientprod_id, ip.swap, i.ingredient_name, i.ingredient_id, i.ingredient_qty, i.optional, p.product_id, p.product_name, p.product_desc, 
            p.product_img, s.stock_id, s.stock_size, s.stock_price, r.recipe_id, r.recipe_img
            from products p, stock s, recipes r, ingredients i, ingredient_product ip
            where r.recipe_id=? and r.recipe_id = i.recipe_id and i.ingredient_id = ip.ingredient_id and ip.stock_id = s.stock_id
            and s.product_id = p.product_id;`
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

    //Get ingredients that we don't for specific recipe
    getUnsoldIngredientsRecipeId: (data) => {
        let values = Object.keys(data).map((key) => data[key]);
        return new Promise((resolve, reject) => {
            let sql = `select i.ingredient_id, i.recipe_id, i.ingredient_name, i.ingredient_qty, i.optional
            from ingredients i left outer join ingredient_product ip on i.ingredient_id = ip.ingredient_id 
            where ip.ingredient_id is null and i.recipe_id = ?;`
            pool.query(sql, values, (error, result) => {
                if (error) {
                    console.log(error)
                    return reject(error)
                }
                if (result.length == 0) {
                    //If cannot find ingredients
                    return reject(404);
                }
                return resolve(result)
            })
        })
    },
}



module.exports = { recipeDB, ingredientDB }