const express = require('express')
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const recipeDB = require('../model/recipes');
const recipe = recipeDB.recipeDB;
const ingredients = recipeDB.ingredientDB

//Role checking middleware
const checkrole = require('./checkrole')
const check = checkrole.check
const perm = require('../access/roles')
const action = perm.actions

//Recipe
//Get recipe by recipe id
app.get('/recipeid/:recipe_id', (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id
    };
    recipe.getRecipeById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            //console.log(`app.js ${err}`);
            switch (err) {
                case 404:
                    res.status(err).send({err: "Recipe not found"});
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get recipe by recipe name
app.get('/recipe/:recipe_name', (req, res) => {
    const data = {
        recipe_name: req.params.recipe_name
    };
    recipe.getRecipeByName(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            switch (err) {
                case 404:
                    res.status(err).send({err: "Recipe not found"});
                    break;
                default:
                    res.status(500).send(err);
            }
        })

})

//Get all recipes
app.get('/recipes', (req, res) => {
    recipe.getAllRecipes()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get recipe by recipe category id
app.get('/recipebycat/:rcat_id', (req, res) => {
    const data = {
        rcat_id: req.params.rcat_id
    };
    recipe.getRecipeByCat(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Create recipe
app.post('/recipe', check.hasPermission(action.CREATE_RECIPES), (req, res) => {
    const data = {
        rcat_id: req.body.rcat_id,
        recipe_name: req.body.recipe_name,
        prep_time: req.body.prep_time,
        cooking_time: req.body.cooking_time,
        recipe_desc: req.body.recipe_desc,
        recipe_img: req.body.recipe_img,
        recipe_step: req.body.recipe_step,
        admin_name: req.body.admin_name,
        visibility: req.body.visibility,
        visibility_start_date: req.body.visibility_start_date,
        visibility_end_date: req.body.visibility_end_date,
    }
    recipe.createRecipe(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err);
        })
})

//Update recipe by recipe id
app.put('/recipe/:recipe_id', check.hasPermission(action.EDIT_RECIPES), (req, res) => {
    const data = {
        rcat_id: req.body.rcat_id,
        recipe_name: req.body.recipe_name,
        prep_time: req.body.prep_time,
        cooking_time: req.body.cooking_time,
        recipe_desc: req.body.recipe_desc,
        recipe_img: req.body.recipe_img,
        recipe_step: req.body.recipe_step,
        admin_name: req.body.admin_name,
        visibility: req.body.visibility,
        visibility_start_date: req.body.visibility_start_date,
        visibility_end_date: req.body.visibility_end_date,
        recipe_id: req.params.recipe_id,
    }
    recipe.updateRecipebyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete recipe by recipe id
app.delete('/recipe/:recipe_id', check.hasPermission(action.DELETE_RECIPES),  (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id,
    }
    recipe.deleteRecipebyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Recipe categories
//Get all recipe categories
app.get('/recipeCategories', (req, res) => {
    recipe.getAllRecipeCategories()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get recipe category by rcat_id
app.get('/recipeCategory/:rcat_id', (req, res) => {
    const data = {
        rcat_id: req.params.rcat_id
    };
    recipe.getRecipeCategoryById(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Add recipe category
app.post('/recipeCategory', check.hasPermission(action.CREATE_RECIPES), (req, res) => {
    const data = {
        rcat_name: req.body.rcat_name
    }
    recipe.addRecipeCategory(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update recipe category by rcat_id
app.put('/recipeCategory', check.hasPermission(action.EDIT_RECIPES), (req, res) => {
    const data = {
        rcat_name: req.body.rcat_name,
        rcat_id: req.body.rcat_id
    }
    recipe.updateRecipeCategoryById(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Delete recipe category by rcat_id
app.delete('/recipeCategory', check.hasPermission(action.DELETE_RECIPES),  (req, res) => {
    const data = {
        rcat_id: req.body.rcat_id
    }
    recipe.deleteRecipeCategoryById(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Ingredients
//Get ingredients by recipe id
app.get('/ingredient/:recipe_id', (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id,
    }
    ingredients.getIngredientsbyRecipeId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Get ingredients by ingredient id
app.get('/ingredientbyid/:ingredient_id', (req, res) => {
    const data = {
        ingredient_id: req.params.ingredient_id,
    }
    ingredients.getIngredientbyIngredientId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Add ingredient
app.post('/ingredient', (req, res) => {
    const data = {
        recipe_id: req.body.recipe_id,
        ingredient_name: req.body.ingredient_name,
        ingredient_qty: req.body.ingredient_qty,
        optional: req.body.optional
    }
    ingredients.addIngredient(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update ingredient by ingredient id
app.put('/ingredient/:ingredient_id', (req, res) => {
    const data = {
        recipe_id: req.body.recipe_id,
        ingredient_name: req.body.ingredient_name,
        ingredient_qty: req.body.ingredient_qty,
        optional: req.body.optional,
        ingredient_id: req.params.ingredient_id
    }
    ingredients.updateIngredientbyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err);
        })
})

//Delete ingredient by ingredient id
app.delete('/ingredient/:ingredient_id', (req, res) => {
    const data = {
        ingredient_id: req.params.ingredient_id,
    }
    ingredients.deleteIngredientbyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Ingredient product
//Get ingredient product by ingredient id
app.get('/ingredientprod/:ingredient_id', (req, res) => {
    const data = {
        ingredient_id: req.params.ingredient_id,
    }
    ingredients.getIngredientProdbyIngredientId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Add ingredient
app.post('/ingredientprod', (req, res) => {
    const data = {
        ingredient_id: req.body.ingredient_id,
        recipe_id: req.body.recipe_id,
        stock_id: req.body.stock_id,
        swap: req.body.swap
    }
    ingredients.addIngredientProd(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Update ingredient product by ingredient product id
app.put('/ingredientprod/:ingredientprod_id', (req, res) => {
    const data = {
        ingredient_id: req.body.ingredient_id,
        recipe_id: req.body.recipe_id,
        stock_id: req.body.stock_id,
        swap: req.body.swap,
        ingredientprod_id: req.params.ingredientprod_id
    }
    ingredients.updateIngredientProdbyId(data)
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err);
        })
})

//Delete ingredient by ingredient id
app.delete('/ingredientprod/:ingredientprod_id', (req, res) => {
    const data = {
        ingredientprod_id: req.params.ingredientprod_id,
    }
    ingredients.deleteIngredientProdbyId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        })
})

//Get ingredient product by recipe id
app.get('/ingredientprodbyrecipeid/:recipe_id', (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id,
    }
    ingredients.getIngredientProdbyRecipeId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(`app.js ${err}`);
            res.status(500).send(err);
        })
})

//Get ingredient product stock by recipe id
app.get('/ingredientproductstockbyrecipeid/:recipe_id', (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id,
    }
    ingredients.getIngredientProductStockByRecipeId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Ingredient, product and recipe not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

//Get ingredients not sold by recipe id
app.get('/ingredientsnotsold/:recipe_id', (req, res) => {
    const data = {
        recipe_id: req.params.recipe_id,
    }
    ingredients.getUnsoldIngredientsRecipeId(data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            switch (err) {
                case 404:
                    res.status(err).send({ err: "Ingredients not found" });
                    break;
                default:
                    res.status(500).send(err);
            }
        })
})

module.exports = app;