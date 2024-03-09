const models = require('../models');
const Validator = require('fastest-validator');
const { Op, literal, Sequelize } = require('sequelize');
const sequelize = new Sequelize('reservation_app', 'root', 'Hoogstraat77', {
    host: '127.0.0.1',
    dialect: 'mysql'
});
const { QueryTypes } = require('sequelize');

/**
 * This function gets a specific business via their id.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function getBusiness(req, res) {
    const id = req.params.id;

    models.Business.findByPk(id, {
        attributes: ['id', 'name', 'email', 'profileImgPath', 'description']
    }).then(result => {
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
    models.Business.findAll({
        attributes: ['id', 'name', 'email', 'profileImgPath', 'description']
    }).then(result => {
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


//Input is an array of business IDs, this function gets business info for all these businesses
function getBusinessesInArray(req, res) {
    const { businessIds } = req.query;

    if (businessIds.length === 0) {
        res.status(200).json({
            businesses: []
        });
        return;
    }

    const businessIdsArray = businessIds.split(',');

    models.Business.findAll({
        attributes: ['id', 'name', 'email', 'profileImgPath', 'description'],
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


//This function gets the location of a specific business
//It is used to mark the business on google maps on the front end
function getBusinessLocation(req, res) {
    const id = req.params.id;

    models.Business.findOne({
        attributes: ['latitude', 'longitude'],
        where: { id: id }
    }).then(result => {
        res.status(200).json(result);
    }).catch((error) => {
        res.status(500).json({
          message: "Something went wrong!",
          error: error
        });
      });
}



//Function gets all business within a set radius from set co-ordinates
//It is used to get all users within a certain radius of the user
async function getBusinessesInRange(req, res) {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);

    const rad = parseInt(req.params.rad, 10);

    

    // console.log("lat: " + lat + ", lng: " + lng + ", rad: " + radius);

    await sequelize.query(
        "SELECT id, name, email, profileImgPath, description FROM businesses b WHERE acos(sin(b.latitude * 0.0175) * sin(:lat * 0.0175) + cos(b.latitude * 0.0175) * cos(:lat * 0.0175) * cos((:lng * 0.0175) - (b.longitude * 0.0175))) * 6371 <= :rad", 
        { replacements: { lat, lng, rad }, type: QueryTypes.SELECT })
            .then(result => {
                res.status(200).json({
                    businesses: result
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Could not fetch businesses!",
                    error: error
                });
            });
}

//TEST INPUT

//const input = req.params.input;
// AND b.name LIKE :input || '%'
//, input: input + '%'

//Gets the description and location info for a specific business
function getBusinessInfo(req, res) {
    const businessId = parseInt(req.params.businessId);

    models.Business.findByPk(businessId, {
        attributes: ['description', 'longitude', 'latitude']
    }).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "Business " + businessId + " not found"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
} 

//Used to update the discription of a business stored in the database
function updateDescription(req, res) {
    const id = parseInt(req.params.id, 10);
    const updatedDescription = {
        description: req.body.description
    };

    //validator
    const schema = {
        description: { type:"string", optional: true, max: "500" }
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedDescription, schema);

    if(validationResponse !== true) {
        return res.status(400).json({
            message: "Data is not valid",
            errors: validationResponse
        });
    }
    
    //Update description in the database
    models.Business.update(updatedDescription, { where: {id: id} }).then(result => {
        res.status(200).json({
            message: "Description updated successfully!",
            description: updatedDescription
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update description!",
            error: error
        });
    });
}

//Used to update the location of a business stored in the database
function updateLocation(req, res) {
    const id = parseInt(req.params.id, 10);
    const updatedLocation = {
        longitude: parseFloat(req.body.longitude),
        latitude: parseFloat(req.body.latitude),
    };

    //validator
    const schema = {
        longitude: { type:"number", integer: false },
        latitude: { type:"number", integer: false }
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedLocation, schema);

    if(validationResponse !== true) {
        return res.status(400).json({
            message: "Data is not valid",
            errors: validationResponse
        });
    }
    
    //Update description in the database
    models.Business.update(updatedLocation, { where: {id: id} }).then(result => {
        res.status(200).json({
            message: "Location updated successfully!",
            location: updatedLocation
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update location!",
            error: error
        });
    });
}

//Used to update both the description and location of a business in the database at the same time
function updateDescriptionAndLocation(req, res) {
    const id = parseInt(req.params.id, 10);
    const updatedInfo = {
        description: req.body.description,
        longitude: parseFloat(req.body.longitude),
        latitude: parseFloat(req.body.latitude),
    };

    //validator
    const schema = {
        description: { type:"string", optional: true, max: "500" },
        longitude: { type:"number", integer: false },
        latitude: { type:"number", integer: false }
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedInfo, schema);

    if(validationResponse !== true) {
        return res.status(400).json({
            message: "Data is not valid",
            errors: validationResponse
        });
    }
    
    //Update description in the database
    models.Business.update(updatedInfo, { where: {id: id} }).then(result => {
        res.status(200).json({
            message: "Location and description updated successfully!",
            info: updatedInfo
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update location and descriptio!",
            error: error
        });
    });
}

module.exports = {
    getBusinesses: getBusinesses,
    getBusiness: getBusiness,
    updateBusiness: updateBusiness,
    getBusinessesInArray: getBusinessesInArray,
    getBusinessLocation: getBusinessLocation,
    getBusinessesInRange: getBusinessesInRange,
    getBusinessInfo: getBusinessInfo,
    updateDescription: updateDescription,
    updateLocation: updateLocation,
    updateDescriptionAndLocation: updateDescriptionAndLocation
}