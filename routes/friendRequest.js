const express = require('express');
const friendRequestController = require('../controllers/friendRequest.controller');

const router = express.Router();

router.post(
    '/:requestUserId/:receiverUserId',
    friendRequestController.addRequest
);

router.delete(
    '/:requestUserId/:receiverUserId',
    friendRequestController.deleteRequest
);

router.get(
    '/:receiverUserId',
    friendRequestController.getRequests
);

module.exports = router;