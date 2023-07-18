const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

//path to sign up a new user account
router.post(
    "/user/signup", //http path
    authController.signupUser //function executing on this path
);

//path to login to existing user account
router.post(
    "/user/login", //http path
    authController.loginUser
);

//path to delete existing user account
router.delete(
    "/user/delete/:id", //http path
    //add middleware here
    authController.deleteUserAccount
);


//path to sign up a new business
router.post(
    "/business/signup", //http path
    authController.signupBusiness
);

//path to login to existing business account
router.post(
    "/business/login", //http path
    authController.loginBusiness
);

//path to delete existing business account
router.delete(
    "/business/delete/:id", //http path
    //add middleware here
    authController.deleteBusinessAccount
);

module.exports = router;