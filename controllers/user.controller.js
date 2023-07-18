const models = require('../models');
const Validator = require('fastest-validator');

/**
 * This function gets a specific user via their id.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function getUser(req, res) {
    const id = req.params.id;

    models.User.findByPk(id).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: "User with id: " + id + ", could not be found!"
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
 * This function gets all users in users database.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function getUsers(req, res) {
    models.User.findAll().then(result => {
        if (result) {
            res.status(200).json({
                users: result
            });
        } else {
            res.status(404).json({
                message: "Users could not be found!"
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Could not fetch users!",
            error: error
        });
    });
}

/**
 * This function updates info on specific user.
 * @param {*} req: the req send by the front end
 * @param {*} res: the response send by the back end
 */
function updateUser(req, res) {
    const id =req.params.id;
    const updatedUser = {
        name: req.body.name,
        email: req.body.email,
        profileImgPath: req.body.profileImgPath,
        description: req.body.description 
    }

    const schema = {
        name: { type:"string", optional: false, max: "40" },
        email: { type: "string", optional: false, max: "100" },
        // profileImgPath: {type:"string", optional: true, max: "40"},
        description: { type:"string", optional: true, max: "500" }
    }

    const v = new Validator();
    const validationResponse = v.validate(updatedUser, schema);

    if(validationResponse !== true) {
        return res.status(400).json({
            message: "Data is not valid",
            errors: validationResponse
        })
    }

    models.User.update(updatedUser, { where: {id: id}}).then(result => {
        res.status(200).json({
            message: "User updated successfully!",
            user: updatedUser
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not update user!",
            error: error
        });
    });
}

function getUsersInArray(req, res) {
    const { ids } = req.query;

    if (ids.length === 0) {
        res.status(200).json({
            profiles: []
        });
        return;
    }

    const idsArray = ids.split(',');

    models.User.findAll({
        where: {
            id: idsArray
        }
    }).then(result => {
        res.status(200).json({
            profiles: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    });
}

module.exports = {
    getUser: getUser,
    getUsers: getUsers,
    updateUser: updateUser,
    getUsersInArray: getUsersInArray
}