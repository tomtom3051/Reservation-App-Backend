const models = require("../models");
const { Op } = require("sequelize");
const Validator = require("fastest-validator");
/**
 * Get all friends of 1 specific user.
 * @param {*} req
 * @param {*} res
 */
async function getFriends(req, res) {
  try {
    const userId = parseInt(req.params.friendId, 10);
    const results = await models.Friend.findAll({
      attributes: ["friend1Id", "friend2Id"],
      where: {
        [Op.or]: [{ friend1Id: userId }, { friend2Id: userId }],
      },
    });

    if (results.length === 0) {
      res.status(200).json({
        friends: [],
      });
      return;
    }

    const friendIds = results.map((result) => {
      if (result.friend1Id === userId) {
        return result.friend2Id;
      } else {
        return result.friend1Id;
      }
    });

    models.User.findAll({
      where: {
        id: friendIds,
      },
    })
      .then((result) => {
        res.status(200).json({
          friends: result,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Something went wrong!",
          error: error,
        });
      });

    // res.status(200).json({
    //   friends: friendIds
    // });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
}
/**
 * Add a specific user as a friend
 * @param {*} req
 * @param {*} res
 */
async function addFriend(req, res) {
  try {
    //construct favorite object
    const friend = {
      friend1Id: parseInt(req.params.friend1Id, 10),
      friend2Id: parseInt(req.params.friend2Id, 10),
    };

    // Check if user exists
    const friend1Result = await models.User.findByPk(friend.friend1Id);
    if (!friend1Result) {
      return res.status(404).json({
        message: "User: " + friend.friend1Id + " does not exist!",
      });
    }

    // console.log(friend1Result.dataValues);

    // Check if user exists
    const friend2Result = await models.User.findByPk(friend.friend2Id);
    if (!friend2Result) {
      return res.status(404).json({
        message: "User: " + friend.friend2Id + " does not exist!",
      });
    }

    // Check if friend relation already exists
    const friendResult = await models.Friend.findOne({
      where: {
        [Op.or]: [
          {
            friend1Id: friend.friend1Id,
            friend2Id: friend.friend2Id,
          },
          {
            friend1Id: friend.friend2Id,
            friend2Id: friend.friend1Id,
          },
        ],
      },
    });

    if (friendResult) {
      return res.status(409).json({
        message: "Friend already exists!",
      });
    }

    // Validate correct format was used
    const schema = {
      friend1Id: { type: "number", optional: false, max: "10000" },
      friend2Id: { type: "number", optional: false, max: "10000" },
    };

    const v = new Validator();
    const validationResponse = v.validate(friend, schema);

    // If data is not valid, return error response
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Invalid data!",
        errors: validationResponse,
      });
    }

    //Test
    // const friendData = await models.User

    // Create friend relation
    const result = await models.Friend.create(friend);
    return res.status(201).json({
      message: "Friend added successfully",
      friend: friend1Result.dataValues,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

function deleteFriend(req, res) {
  const friend = {
    friend1Id: parseInt(req.params.friend1Id),
    friend2Id: parseInt(req.params.friend2Id),
  };

  models.Friend.destroy({
    where: {
      [Op.or]: [
        {
          friend1Id: friend.friend1Id,
          friend2Id: friend.friend2Id,
        },
        {
          friend1Id: friend.friend2Id,
          friend2Id: friend.friend1Id,
        },
      ],
    },
  })
    .then((result) => {
      res.status(200).json({
        message: "Friend removed!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    });
}


//Function to check friend status between 2 users
function checkFriendStatus(req, res) {
  //Get ID's of users from params
  //userId is user logged in on the front end
  const userId = req.params.id1;
  //pageId is the id of the user page the logged in user is currently viewing
  const pageId = req.params.id2;

  //Check if there is a friend relation between the users stored in the friends database
  const friendCheckPromise = models.Friend.findOne({
    where: {
      [Op.or]: [
        { friend1Id: userId, friend2Id: pageId },
        { friend1Id: pageId, friend2Id: userId },
      ],
    },
  });

  //Check if there is a friend request from userId to pageId
  const friendRequestFromUserToPagePromise = models.FriendRequest.findOne({
    where: {
      requestUserId: userId,
      receiverUserId: pageId,
    },
  });

  //Check if there is a request from pageId to userId
  const friendRequestFromPageToUserPromise = models.FriendRequest.findOne({
    where: {
      requestUserId: pageId,
      receiverUserId: userId,
    },
  });

  Promise.allSettled([friendCheckPromise, friendRequestFromUserToPagePromise, friendRequestFromPageToUserPromise])
    .then((results) => {
      const [friendResult, requestFromUserResult, requestFromPageResult] = results.map(result => result.value);

      if (friendResult) {
        res.status(200).json({ status: "friends" });
      } else if (requestFromUserResult) {
        res.status(200).json({ status: "requester" });
      } else if (requestFromPageResult) {
        res.status(200).json({ status: "requested" });
      } else {
        res.status(200).json({ status: "none" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
        error: error,
      });
    });
}

module.exports = {
  getFriends: getFriends,
  addFriend: addFriend,
  deleteFriend: deleteFriend,
  checkFriendStatus: checkFriendStatus,
};
