const perm = require('./roles')
const roles = perm.roles
const actions = perm.actions
const access = new Map();

//Products access
access.set(actions.VIEW_PRODUCTS, [roles.ROOT_ADMIN, roles.OPERATIONS, roles.CONTENT, roles.USER])
access.set(actions.CREATE_PRODUCTS, [roles.ROOT_ADMIN, roles.CONTENT])
access.set(actions.EDIT_PRODUCTS, [roles.ROOT_ADMIN, roles.CONTENT])
access.set(actions.DELETE_PRODUCTS, [roles.ROOT_ADMIN, roles.CONTENT])

//Recipes access
access.set(actions.VIEW_RECIPES, [roles.ROOT_ADMIN, roles.OPERATIONS, roles.CONTENT, roles.USER])
access.set(actions.CREATE_RECIPES, [roles.ROOT_ADMIN, roles.CONTENT])
access.set(actions.EDIT_RECIPES, [roles.ROOT_ADMIN, roles.CONTENT])
access.set(actions.DELETE_RECIPES, [roles.ROOT_ADMIN, roles.CONTENT])

//Orders access
access.set(actions.VIEW_ORDERS, [roles.ROOT_ADMIN, roles.OPERATIONS])
access.set(actions.EDIT_ORDERS, [roles.ROOT_ADMIN, roles.OPERATIONS])
access.set(actions.DELETE_ORDERS, [roles.ROOT_ADMIN, roles.OPERATIONS])

//Discount access
access.set(actions.VIEW_DISCOUNT, [roles.ROOT_ADMIN, roles.OPERATIONS])
access.set(actions.CREATE_DISCOUNT, [roles.ROOT_ADMIN, roles.OPERATIONS])
access.set(actions.EDIT_DISCOUNT, [roles.ROOT_ADMIN, roles.OPERATIONS])
access.set(actions.DELETE_DISCOUNT, [roles.ROOT_ADMIN, roles.OPERATIONS])

//Admin access
access.set(actions.VIEW_ADMIN, [roles.ROOT_ADMIN])
access.set(actions.CREATE_ADMIN, [roles.ROOT_ADMIN])
access.set(actions.EDIT_ADMIN, [roles.ROOT_ADMIN])
access.set(actions.DELETE_ADMIN, [roles.ROOT_ADMIN])

//User access
access.set(actions.VIEW_USER, [roles.ROOT_ADMIN])
access.set(actions.CREATE_USER, [roles.ROOT_ADMIN])
access.set(actions.EDIT_USER, [roles.ROOT_ADMIN])
access.set(actions.DELETE_USER, [roles.ROOT_ADMIN])

function checkAccess(user, action) {
    console.log(user.access_right)
    console.log(action)
    if (!user?.access_right) {
        return false;
    }
    if (access.has(action)) {
        return access.get(action).includes(user.access_right);
    }

    return false;
}

module.exports = checkAccess