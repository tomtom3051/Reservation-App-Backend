const express = require('express');
const businessHoursController = require('../controllers/businessHours.controller');

const router = express.Router();

//Route to get all business hours for a specific business
router.get(
    "/:businessId",
    businessHoursController.getBusinessHours
);

//Route to add business hours to a specific business
router.post(
    "/add",
    businessHoursController.addBusinessHours
);

//Route to delete all business hours from a specific business
router.delete(
    "/:businessId",
    businessHoursController.deleteBusinessHours
);

//Route to update hours from a specific business for a specific day
router.patch(
    "/:businessId/:day",
    businessHoursController.updateBusinessHours
);

//Route to get business hours for a specific day
router.get(
    "/:businessId/:day",
    businessHoursController.getDayBusinessHours
);

module.exports = router;