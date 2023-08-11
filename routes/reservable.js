const express = require('express');
const reservableController = require('../controllers/reservable.controller');

const router = express.Router();

router.post(
    "/add",
    reservableController.addReservable
);

router.get(
    "/get/:businessId",
    reservableController.getReservables
);

router.patch(
    "/update/:reservableId",
    reservableController.updateReservable
);

router.delete(
    "/delete/:reservableId",
    reservableController.deleteReservable
);

module.exports = router;