const models = require('../models');

//Saves a reservable object to the backend
function addReservable(req, res) {
    //Checks if there is already a pre existing reservable with this floorplan id and label
    //If so reservable is not added since no floorplan can have 2 reservables with the same label
    models.Reservable.findOne({
        where: {
            floorplanId: parseInt(req.body.floorplanId, 10),
            label: req.body.label
        }
    }).then(result => {
        //Sends error message if result is found
        if (result) {
            res.status(409).json({
                message: "Floorplan " + req.body.floorplanId + " already has a reservable labled " + req.body.label
            });
        } else {
            //If no reservable is found, a reservable object with all the relevant data is created
            const reservable = {
                floorplanId: parseInt(req.body.floorplanId, 10),
                businessId: parseInt(req.body.businessId, 10),
                x: parseInt(req.body.x, 10),
                y: parseInt(req.body.y, 10),
                height: parseInt(req.body.height, 10),
                width: parseInt(req.body.width, 10),
                capacity: parseInt(req.body.capacity, 10),
                label: req.body.label
            };

            //Add validator here

            //This reservable object is then saved to the backend
            models.Reservable.create(reservable).then(result => {
                res.status(201).json({
                    id: result.id,
                    floorplanId: result.floorplanId,
                    businessId: result.businessId,
                    x: result.x,
                    y: result.y,
                    height: result.height,
                    width: result.width,
                    capacity: result.capacity,
                    label: result.label
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

//This function gets all reservables of a specific business from the backend
function getReservables(req, res) {
    //Finds all reservables with params businessId as their businessId
    models.Reservable.findAll({
        attributes: ['id', 'floorplanId', 'businessId', 'x', 'y', 'height', 'width', 'capacity', 'label'],
        where: {
            businessId: parseInt(req.params.businessId, 10)
        }
    }).then(result => {
        //Sends them back as a reservables array via a json object
        res.status(200).json({
            reservables: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

//Deletes a specific reservable from the backend
function deleteReservable(req, res) {
    //Destroys entry where id matches id of reservable being destroyed
    models.Reservable.destroy({
        where: {
            id: parseInt(req.params.reservableId)
        }
    }).then(result => {
        res.status(200).json({
            message: "Reservable deleted!"
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong!',
            error: error
        });
    });
}

//Function updates a reservable already stored in the backend
function updateReservable(req, res) {
    const updatedReservable = {
        floorplanId: parseInt(req.body.floorplanId, 10),
        businessId: parseInt(req.body.businessId, 10),
        x: parseInt(req.body.x, 10),
        y: parseInt(req.body.y, 10),
        height: parseInt(req.body.height, 10),
        width: parseInt(req.body.width, 10),
        capacity: parseInt(req.body.capacity, 10),
        label: req.body.label
    };

    //Add validator here

    models.Reservable.update(
        updatedReservable,
        {
            where: { id: parseInt(req.params.reservableId, 10) }
        }
    ).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Reservable updated successfully!",
            reservable: updatedReservable
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update reservable!",
            error: error
        });
    });
}

module.exports = {
    addReservable: addReservable,
    getReservables: getReservables,
    deleteReservable: deleteReservable,
    updateReservable: updateReservable
}