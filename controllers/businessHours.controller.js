const models = require('../models');
const Validator = require('fastest-validator');


function getBusinessHours(req, res) {
    const id = req.params.businessId;

    models.BusinessHours.findAll({
        attributes: ['day', 'opening_time', 'closing_time'],
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

function addBusinessHours(req, res) {
    //First check if an entry for this business on this day already exists
    console.log('reached');
    models.BusinessHours.findOne({
        where: {
            businessId: req.body.businessId,
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

function deleteBusinessHours(req, res) {
    
}

function updateBusinessHours(req, res) {
    const businessId = parseInt(req.params.businessId, 10);
    const day = req.params.day;

    const updatedEntry = {
        businessId: req.body.businessId,
        day: req.body.day,
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time
    }

    models.BusinessHours.update(updatedEntry, {
        where: {
            businessId: businessId,
            day: day
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