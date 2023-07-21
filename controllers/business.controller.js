const models = require('../models');
const Validator = require('fastest-validator');

/**
 * This function gets a specific business via their id.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function getBusiness(req, res) {
    const id = req.params.id;

    models.Business.findByPk(id).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "Business with id: " + id + ", could not be found!"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

/**
 * This function gets all businesses.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function getBusinesses(req, res) {
    models.Business.findAll().then(result => {
        if (result) {
            res.status(200).json({
                businesses: result
            });
        } else {
            res.status(404).json({
                message: "Businesses could not be found!"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Could not fetch business!",
            error: error
        });
    });
}

/**
 * This function updates the info of a business.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function updateBusiness(req, res) {
    const id = req.params.id;
    const updatedBusiness = {
        //in final version only location, description and imgPath should be changable.
        name: req.body.name,
        email: req.body.email,
        profileImgPath: req.body.profileImgPath,
        description: req.body.description,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    }

    const schema = {
        name: { type:"string", optional: false, max: "40" },
        email: { type: "string", optional: false, max: "100" },
        // profileImgPath: {type:"string", optional: true, max: "40"},
        description: { type:"string", optional: true, max: "500" },
        //replace with lon and lat
        //location: { type: "string", optional: true, max: "100" }
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedBusiness, schema);

    if(validationResponse !== true) {
        return res.status(400).json({
            message: "Data is not valid",
            errors: validationResponse
        })
    }

    models.Business.update(updatedBusiness, { where: {id: id}}).then(result => {
        res.status(200).json({
            message: "Business updated successfully!",
            Business: updatedBusiness
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update business!",
            error: error
        });
    });
}

function getBussinessesInArray(req, res) {
    const { businessIds } = req.query;

    if (businessIds.length === 0) {
        res.status(200).json({
            businesses: []
        });
        return;
    }

    const businessIdsArray = businessIds.split(',');

    models.Business.findAll({
        where: {
            id: businessIdsArray
        }
    }).then(result => {
        res.status(200).json({
            businesses: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}


module.exports = {
    getBusinesses: getBusinesses,
    getBusiness: getBusiness,
    updateBusiness: updateBusiness,
    getBussinessesInArray: getBussinessesInArray
}