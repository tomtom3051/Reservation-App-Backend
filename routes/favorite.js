const express = require('express');
const favoriteController = require('../controllers/favorite.controller');

const router = express.Router();

//Path to add a new business to favorites
router.post(
    "/:userId/:businessId", //http path
    //add middleware to authenticate request comes from a user
    favoriteController.addFavorite
);

//Path to get favorites of a specific user
router.get(
    "/:userId",
    favoriteController.getFavorites
);

//Path to remove a favorite connection
router.delete(
    "/:userId/:businessId",
    favoriteController.deleteFavorite
);

//Path to check if a user has a business as a favorite
router.get(
    "/:userId/:businessId",
    favoriteController.checkFavorite
);


module.exports = router;