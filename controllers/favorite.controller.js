const models = require("../models");
const Validator = require("fastest-validator");

/**
 * Function adds a business as a favorite for a specific user
 * user and business specified in req params
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addFavorite(req, res) {
  try {
    //construct favorite object
    const favorite = {
      userId: parseInt(req.params.userId, 10),
      businessId: parseInt(req.params.businessId, 10),
    };

    // Check if user exists
    const userResult = await models.User.findByPk(favorite.userId);
    if (!userResult) {
      return res.status(404).json({
        message: "User: " + favorite.userId + " does not exist!",
      });
    }

    // Check if business exists
    const businessResult = await models.Business.findByPk(favorite.businessId);
    if (!businessResult) {
      return res.status(404).json({
        message: "Business: " + favorite.businessId + " does not exist!",
      });
    }

    // Check if favorite relation already exists
    const favResult = await models.Favorite.findOne({
      where: { userId: favorite.userId, businessId: favorite.businessId },
    });

    if (favResult) {
      return res.status(409).json({
        message: "Favorite already exists!",
      });
    }

    // Validate correct format was used
    const schema = {
      userId: { type: "number", optional: false, max: "10000" },
      businessId: { type: "number", optional: false, max: "10000" },
    };

    const v = new Validator();
    const validationResponse = v.validate(favorite, schema);

    // If data is not valid, return error response
    if (validationResponse !== true) {
      return res.status(400).json({
        message: "Invalid data!",
        errors: validationResponse,
      });
    }

    // Create favorite relation
    const result = await models.Favorite.create(favorite);
    return res.status(201).json({
      message: "Favorite added successfully",
      favorite: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      error: error,
    });
  }
}

/**
 * Removes business as a favorite for a user if a favorite relation exists
 * Business and user specified in req params
 * @param {*} req 
 * @param {*} res 
 */
function deleteFavorite(req, res) {
    const favorite = {
        userId: parseInt(req.params.userId, 10),
        businessId: parseInt(req.params.businessId, 10),
    };

    models.Favorite.destroy({ where: { userId: favorite.userId, businessId: favorite.businessId } }).then(result => {
        res.status(200).json({
            message: "Favorite removed!"
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong!',
            error: error
        });
    });
}

/**
 * This function checks if if there is a favorite relationship between a specific user and business
 * @param {*} req 
 * @param {*} res 
 */
function checkFavorite(req, res) {
  const favorite = {
    userId: parseInt(req.params.userId, 10),
    businessId: parseInt(req.params.businessId, 10),
  };

  models.Favorite.findOne({
    where: { userId: favorite.userId, businessId: favorite.businessId },
  }).then(result => {
    if (result) {
      res.status(200).json({
        isFavorite: true
      });
    } else {
      res.status(200).json({
        isFavorite: false
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error
  });
  });
}

/**
 * Function gets all favorites for a specific user
 * User specified in req params.
 * @param {*} req 
 * @param {*} res 
 */
function getFavorites(req, res) {
  //get user id
  const userId = parseInt(req.params.userId, 10);
  //find all businesses ids in a favorite relation with given user id
  models.Favorite.findAll({
    where: { userId: userId },
    attributes: ['businessId']
  }).then((result) => {
    if (result.length > 0) {
      //store these ids in an array
      const businessIds = result.map(favorite => favorite.businessId);
      //find all businesses with these ids
      models.Business.findAll({
        where: {
            id: businessIds
        },
        attributes: ['id', 'name', 'email', 'profileImgPath', 'description']
      }).then(result => {
        res.status(200).json({
            favorites: result
        });
      }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
      });

    } else {
      res.status(200).json({
        favorites: []
      });
    }
  }).catch((error) => {
    res.status(500).json({
      message: "Something went wrong!",
      error: error
    });
  });
}

module.exports = {
  addFavorite: addFavorite,
  getFavorites: getFavorites,
  deleteFavorite: deleteFavorite,
  checkFavorite: checkFavorite
};
