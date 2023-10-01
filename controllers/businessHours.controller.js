const models = require('../models');
const Validator = require('fastest-validator');

/**
 * Function gets business hours for one specific business specified by the businessId in the params
 * @param {*} req 
 * @param {*} res 
 */
function getBusinessHours(req, res) {
    const id = req.params.businessId;

    models.BusinessHours.findAll({
        attributes: ['id', 'day', 'opening_time', 'closing_time'],
        where: {
            businessId: id
        }
    }).then(result => {
        res.status(200).json({
            hours: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

/**
 * Function adds business hours for a specific business for a specific day both specified in the
 * req body
 * @param {*} req 
 * @param {*} res 
 */
function addBusinessHours(req, res) {
    //First check if an entry for this business on this day already exists
    // console.log('reached');
    models.BusinessHours.findOne({
        where: {
            businessId: parseInt(req.body.businessId, 10),
            day: req.body.day
        }
    }).then(result => {
        if (result) {
            res.status(409).json({
                message: "day already has hours"
            });
        } else {
            const openingHours = req.body.opening_time;
            const closingHours = req.body.closing_time;

            if (openingHours < closingHours) {
                const entry = {
                    businessId: req.body.businessId,
                    day: req.body.day,
                    opening_time: openingHours,
                    closing_time: closingHours
                }
                
                models.BusinessHours.create(entry).then(result => {
                    res.status(201).json({
                        message: "Hours added successfully",
                        result: result
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: "Something went wrong!",
                        error: error
                    });
                });
            } else {
                res.status(400).json({
                    message: "Opening hours should be earlier than closing hours"
                });
            }
        } 
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

/**
 * Function deletes business hours based on the id they are stored with
 * @param {*} req 
 * @param {*} res 
 */
function deleteBusinessHours(req, res) {
    const hoursId = parseInt(req.params.hoursId, 10);

    models.BusinessHours.destroy({
        where: {
            id: hoursId
        }
    }).then(result => {
        res.status(200).json({
            message: "Business hours removed!"
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong!',
            error: error
        });
    });
}

/**
 * Function updates business hours for a specific business for a specific day
 * based on the id of the current hours info
 * @param {*} req 
 * @param {*} res 
 */
function updateBusinessHours(req, res) {
    const hoursId = parseInt(req.params.hoursId, 10);

    const updatedhours = {
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time
    }

    models.BusinessHours.update(updatedhours, {
        where: {
            id: hoursId
        }
    }).then(result => {
        res.status(200).json({
            message: "Updated successfully",
            result: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });

}


/**
 * Function gets business hours for a specific day and a specific business
 * Day and business specified in the req params
 * @param {*} req 
 * @param {*} res 
 */
function getDayBusinessHours(req, res) {
    const businessId = parseInt(req.params.businessId, 10);
    const day = req.params.day;

    models.BusinessHours.findOne({
        attributes: ['opening_time', 'closing_time'],
        where: {
            businessId: businessId,
            day: day
        }
    }).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                businessHours: "closed"
            });
        }
        
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

module.exports = {
    getBusinessHours: getBusinessHours,
    addBusinessHours: addBusinessHours,
    deleteBusinessHours: deleteBusinessHours,
    updateBusinessHours: updateBusinessHours,
    getDayBusinessHours: getDayBusinessHours
}