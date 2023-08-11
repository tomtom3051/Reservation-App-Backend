const express = require('express');
const floorplanController = require('../controllers/floorplan.controller');

const router = express.Router();

router.post(
    "/add",
    floorplanController.addFloorplan
);

router.get(
    "/get/:businessId",
    floorplanController.getFloorplans
);

router.delete(
    "/delete/:businessId/:floorplanId",
    floorplanController.deleteFloorplan
);

module.exports = router;