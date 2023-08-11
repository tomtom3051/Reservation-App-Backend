const models = require('../models');
const { Op } = require('sequelize');

/**
 * Adds a friend request from request user to receive user
 * users specified in req params.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addRequest(req, res) {
    try {
        const request = {
            requestUserId: parseInt(req.params.requestUserId, 10),
            receiverUserId: parseInt(req.params.receiverUserId,10)
        };

        // Check if requester exists
        const requesterExists = await models.User.findByPk(request.requestUserId);
        if (!requesterExists) {
          return res.status(404).json({
            message: "User: " + request.requestUserId + " does not exist!",
          });
        }
    
        // Check if receiver exists
        const receiverExists = await models.User.findByPk(request.receiverUserId);
        if (!receiverExists) {
          return res.status(404).json({
            message: "User: " + request.receiverUserId + " does not exist!",
          });
        }

        //Check if there is already a request
        const requestExists = await models.FriendRequest.findOne({
            where: {
                [Op.or]: [
                    {
                        requestUserId: request.requestUserId,
                        receiverUserId: request.receiverUserId
                    }, {
                        requestUserId: request.receiverUserId,
                        receiverUserId: request.requestUserId
                    }
                ]
            }
        });

        if (requestExists) {
            return res.status(409).json({
                message: "Friend request already exists between these users!"
            });
        }

        //Check if users are already friends
        const friendshipExists = await models.Friend.findOne({
            where: {
                [Op.or]: [
                    {
                        friend1Id: request.requestUserId,
                        friend2Id: request.receiverUserId
                    }, {
                        friend1Id: request.receiverUserId,
                        friend2Id: request.requestUserId
                    }
                ]
            }
        });

        if (friendshipExists) {
            return res.status(409).json({
                message: "Users are already friends!"
            });
        }
        //Add validator here to check if input is in correct format

        const result = await models.FriendRequest.create(request);
        return res.status(201).json({
            message: "Request added successfully!",
            request: result
        });

    } catch (error) {
        return res.status(500).json({
          message: "Something went wrong!",
          error: error,
        });
    }
}

/**
 * Deletes a friend request between users when request is denied or accepted
 * @param {*} req 
 * @param {*} res 
 */
function deleteRequest(req, res) {
    const request = {
        requestUserId: parseInt(req.params.requestUserId, 10),
        receiverUserId: parseInt(req.params.receiverUserId,10)
    };

    models.FriendRequest.destroy({
        where: {
            requestUserId: request.requestUserId,
            receiverUserId: request.receiverUserId
        }
    }).then(result => {
        res.status(200).json({
            message: "Request removed!"
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong!',
            error: error
        });
    });

}

async function getRequests(req, res) {
    try {
        const receiverUserId = parseInt(req.params.receiverUserId, 10);

        const results = await models.FriendRequest.findAll({
            attributes: ['requestUserId'],
            where: {
                receiverUserId: receiverUserId
            }
        });

        const requestIds = results.map(result => {
            return result.requestUserId;
        });

        models.User.findAll({
            where: {
                id: requestIds
            }
          }).then(result => {
            res.status(200).json({
                requests: result
            });
          }).catch(error => {
            res.status(500).json({
                message: "Something went wrong!",
                error: error
            });
          });
    } catch (error) {
        return res.status(500).json({
          message: "Something went wrong!",
          error: error,
        });
    }
}

function checkRequest(req, res) {}

module.exports = {
    addRequest: addRequest,
    deleteRequest: deleteRequest,
    getRequests: getRequests
}