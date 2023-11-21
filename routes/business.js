const express = require('express');
const businessController = require('../controllers/business.controller');

const router = express.Router();

//Path to get all businesses with their id in the json object attached
router.get(
    "/favorites",
    businessController.getBusinessesInArray
);

router.get(
    "/location/:id",
    businessController.getBusinessLocation
)

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
    "/update/:id", //http path
    //add middleware to authenticate request comes from a the business itself
    businessController.updateBusiness
);

//Path to update description info
router.patch(
    "/description/:id",
    businessController.updateDescription
);

//Path to update location info
router.patch(
    "/location/:id",
    businessController.updateLocation
);

//Path to update location and description info
router.patch(
    "/locdesc/:id",
    businessController.updateDescriptionAndLocation
);

//Path to get all businesses in a given radius from a given position
router.get(
    "/find/:lat/:lng/:rad",
    businessController.getBusinessesInRange
);

//Path to get location and description info for specific business
router.get(
    "/info/:businessId",
    businessController.getBusinessInfo
);

module.exports = router;

/**
 * Errors:
 * when /favorites is bellow /:id get request, sending /favorites activates /:id with favprites as the id
 * Currently fixed by moving /favorites above /:id but might need a better fix later
 */