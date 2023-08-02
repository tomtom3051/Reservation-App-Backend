const Validator = require('fastest-validator');
const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * This function adds a new user to the user database.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function signupUser(req, res) {
    models.User.findOne({ where: { 
        [Op.or]: [{ email: req.body.email }, { name: req.body.name }]
    } }).then(result => {
        //if result email is in use
        if (result) {
            res.status(409).json({
                message: "email or username taken!"
            });
        } else {
            //bcryptjs is used here to encrypt the password into variable hash
            bcryptjs.genSalt(10, function(err,salt) {
                bcryptjs.hash(req.body.password, salt, function(err, hash) {
                    //set up the user construct to be saved to the database
                    //save hash as password as it is the encrypted password
                    const user = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        //Not sure if this location is correct but can be changed later.
                        profileImgPath: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
                        description: ''
                    }

                    //Schema bellow is used to validate user details before allowing them into the database
                    const schema = {
                        name: { type: "string", optional: false, max: "40" },
                        email: { type: "string", optional: false, max: "100" },
                        //description: { type: "string", optional: false, max: "500" }
                    }

                    const v = new Validator();
                    const validationResponse = v.validate(user, schema);

                    //If data is not valid return error response
                    if(validationResponse !== true) {
                        return res.status(400).json({
                            message: "Invalid data!",
                            errors: validationResponse
                        });
                    }

                    //If data is valid add the user contruct to the database
                    models.User.create(user).then(result => {
                        res.status(201).json({
                            message: "User created successfully!",
                            user: result
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                            error: error
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

/**
 * This function logs a user in and provides a json web token
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function loginUser(req, res) {
    //check if user exists in database
     models.User.findOne({ where: { email: req.body.email } }).then(user => {
         //if not send invalid credentials error
         if (user === null) {
             res.status(401).json({
                 message: "Invalid credentials!"
             });
         } else {
             //bcrypt compares the given passwords
             bcryptjs.compare(req.body.password, user.password, function(err, result) {
                 //if password is correct a json web token is created and send to the user
                 if (result) {
                     jwt.sign({
                         email: user.email,
                         userId: user.id,
                         name: user.name
                     }, process.env.JWT_TOKEN, function(err, token) {
                         if (err) {
                             res.status(500).json({
                                message: "Error occurred while generating token",
                                error: err
                             });
                         } else {
                             res.status(200).json({
                                message: "Authentication successful!",
                                token: token,
                                id: user.id
                             });
                         }
                     });
                 } else {
                     res.status(401).json({
                         message: "Invalid credentials"
                     });
                 }
             });
         }
     }).catch(error => {
         res.status(500).json({
             message: "Something went wrong",
             error: error
         });
     });
}

/**
 * This function is used to delete an existing account
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function deleteUserAccount(req, res) {
    //get id from http parameters
    const id = req.params.id;

    //find and destroy an entry in users with the given id as its id
    models.User.destroy({ where: { id: id } }).then(result => {
        res.status(200).json({
            message: "User account deleted successfully!"
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not delete user!",
            error: error
        });
    });
}

/**
 * This function is used to sign up a new Business account
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function signupBusiness(req, res) {
    models.Business.findOne({ where: { email: req.body.email } }).then(result => {
        //if result email is in use
        if (result) {
            res.status(409).json({
                message: "email taken!"
            });
        } else {
            //bcryptjs is used here to encrypt the password into variable hash
            bcryptjs.genSalt(10, function(err,salt) {
                bcryptjs.hash(req.body.password, salt, function(err, hash) {
                    //set up the business construct to be saved to the database
                    //save hash as password as it is the encrypted password
                    const business = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        profileImgPath: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
                        description: ''
                        //longitude: req.body.longitude
                        //latitude: req.body.latitude
                    }

                    //Schema bellow is used to validate user details before allowing them into the database
                    const schema = {
                        name: { type: "string", optional: false, max: "40" },
                        email: { type: "string", optional: false, max: "100" },
                        description: { type: "string", optional: false, max: "500" }
                    }

                    const v = new Validator();
                    const validationResponse = v.validate(business, schema);

                    //If data is not valid return error response
                    if(validationResponse !== true) {
                        return res.status(400).json({
                            message: "Invalid data!",
                            errors: validationResponse
                        });
                    }

                    //If data is valid add the user contruct to the database
                    models.Business.create(business).then(result => {
                        res.status(201).json({
                            message: "Business created successfully!",
                            business: result
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong!",
                            error: error
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

/**
 * This function is used to log into an existing business account
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function loginBusiness(req, res) {
    //check if user exists in database
    models.Business.findOne({ where: { email: req.body.email } }).then(business => {
        //if not send invalid credentials error
        if (business === null) {
            res.status(401).json({
                message: "Invalid credentials!"
            });
        } else {
            //bcrypt compares the given passwords
            bcryptjs.compare(req.body.password, business.password, function(err, result) {
                //if password is correct a json web token is created and send to the user
                if (result) {
                    jwt.sign({
                        email: business.email,
                        businessId: business.id,
                        name: business.name
                    }, process.env.JWT_TOKEN, function(err, token) {
                        if (err) {
                            res.status(500).json({
                                message: "Error occurred while generating token",
                                error: err
                            });
                        } else {
                            res.status(200).json({
                                message: "Authentication successful!",
                                token: token
                            });
                        }
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid credentials"
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    });
}

/**
 * This function is used to let a business delete their existing account
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function deleteBusinessAccount(req, res) {
    //get id from http parameters
    const id = req.params.id;

    //find and destroy an entry in Businesses with the given id as its id
    models.Business.destroy({ where: { id: id } }).then(result => {
        res.status(200).json({
            message: "Business account deleted successfully!"
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update business!",
            error: error
        });
    });
}

/**
 * This function is used to update the location and description of a business
 * @param {*} req : the req send by the front end
 * @param {*} res : the response send by the back end
 */
function updateBussinessInfo(req, res) {

}

module.exports = {
    signupUser: signupUser,
    loginUser: loginUser,
    deleteUserAccount: deleteUserAccount,

    signupBusiness: signupBusiness,
    loginBusiness: loginBusiness,
    deleteBusinessAccount: deleteBusinessAccount,
    updateBussinessInfo: updateBussinessInfo
}