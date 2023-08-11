const models = require('../models');

/**
 * Adds a floorplan for a specific business
 * Business and floorplan data specified in req body
 * @param {*} req 
 * @param {*} res 
 */
function addFloorplan(req, res) {
    models.Floorplan.findOne({
        where: {
            businessId: parseInt(req.body.businessId, 10),
            name: req.body.name
        }
    }).then(result => {
        if (result) {
            res.status(409).json({
                message: "Business " + req.body.businessId + " already has a floorplan called " + req.body.name
            });
        } else {
            const floorplan = {
                businessId: parseInt(req.body.businessId, 10),
                height: parseInt(req.body.height, 10),
                width: parseInt(req.body.width, 10),
                name: req.body.name
            };

            models.Floorplan.create(floorplan).then(result => {
                res.status(201).json({
                    id: result.id,
                    businessId: result.businessId,
                    height: result.height,
                    width: result.width,
                    name: result.name
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong!",
                    error: error
                });
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
 * Gets all floorplans for a specific business
 * @param {*} req 
 * @param {*} res 
 */
function getFloorplans(req, res) {
    models.Floorplan.findAll({
        attributes: ['id', 'businessId', 'height', 'width', 'name'],
        where: {
            businessId: parseInt(req.params.businessId, 10)
        }
    }).then(result => {
        res.status(200).json({
            floorplans: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

/**
 * Deletes specific floorplan for a specific business
 * @param {*} req 
 * @param {*} res 
 */
function deleteFloorplan(req, res) {
    models.Floorplan.destroy({
        where: {
            id: parseInt(req.params.floorplanId, 10),
            businessId: parseInt(req.params.businessId, 10)
        }
    }).then(result => {
        res.status(200).json({
            message: "Floorplan deleted"
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong!',
            error: error
        });
    });
}


module.exports = {
    addFloorplan: addFloorplan,
    getFloorplans: getFloorplans,
    deleteFloorplan: deleteFloorplan
};