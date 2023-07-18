const express = require('express');
const friendController = require('../controllers/friend.controller');

const router = express.Router();

//Path to get all friends of friendId
router.get(
    '/:friendId',
    friendController.getFriends
);

//Path to create a friend reltionship
//For now friends are just added instead of requested
//Requests will be added when I figure them out
router.post(
    '/:friend1Id/:friend2Id',
    friendController.addFriend
);

//Path to delete friend relationship
router.delete(
    '/:friend1Id/:friend2Id',
    friendController.deleteFriend
);

module.exports = router;