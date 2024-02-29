const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get(
    "/find/:id/:username",
    userController.searchByUsername
);

//Path to get users in provided params array
router.get(
    "/friends",
    userController.getUsersInArray
);

//path to get a specific user
router.get(
    "/:id",
    //middleware needed
    userController.getUser
);

//path to get all users
router.get(
    "/",
    //middleware needed
    userController.getUsers
);

//path to update users
router.patch(
    "/:id",
    //middleware
    userController.updateUser
);

//Update Profile pic and description
router.patch(
    "/update/:id",
    //middleware needed
    userController.updateProfilePictureDescription
)

module.exports = router;