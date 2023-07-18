const express = require('express');
const businessController = require('../controllers/business.controller');

const router = express.Router();

//Path to get all businesses with their id in the json object attached
router.get(
    "/favorites",
    businessController.getBussinessesInArray
);

//path to get info on specific business
router.get(
    "/:id", //http path
    //add middleware to authenticate request comes from a user
    businessController.getBusiness
);

//path to get all businesses (will be changed to all businesses in given range)
router.get(
    "/", //http path
    //add middleware to authenticate request comes from a user
    businessController.getBusinesses
);

//Path to update values in business table
router.patch(
    "/:id", //http path
    //add middleware to authenticate request comes from a the business itself
    businessController.updateBusiness
);

module.exports = router;

/**
 * Errors:
 * when /favorites is bellow /:id get request, sending /favorites activates /:id with favprites as the id
 * Currently fixed by moving /favorites above /:id but might need a better fix later
 */