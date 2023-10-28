const db = require("../Model");
const User = db.user;
const BestMatch = db.bestmatch;
const geolib = require('geolib');
const Profile = db.profile;
const Hobbies = db.hobbies;
const { Op } = require('sequelize');



exports.bestMatch = async (req, res) => {
  try {
   
    const uploadstatus = await BestMatch.create({
      Image: req.file.filename,
      location: req.body.location,
      userId: req.body.userId,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      country: req.body.country,
      
    });

    res.status(201).json({
      status: "success",
      uploadstatus: uploadstatus,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};




exports.getBestMatch = async (req, res) => {
  try {
    const { latitude, longitude, userGender } = req.query;
    let startIndex = ((req.query.page * 5) - 5);
    
    const allImages = await BestMatch.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "email", "password"],
          },
        },
        
      ],
      limit: 5,
      offset: startIndex,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const imagesWithinRadius = allImages.filter(image => {
      const user = image.dataValues.user; // Access user object within dataValues
      if (user) {
        const isMaleUser = userGender === 'Male'; 
        const isFemaleImage = user.dataValues.gender === 'Female'; // Access gender within dataValues
        
        if ((isMaleUser && isFemaleImage) || (!isMaleUser && !isFemaleImage)) {
          const distance = geolib.getDistance(
            { latitude: parseFloat(image.latitude), longitude: parseFloat(image.longitude) },
            { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
          );
          return distance <= 25000; // 25km in meters
        }
      }
      
      return false;
    });

    res.status(200).json({
      status: 'success',
      matchedUsers: imagesWithinRadius
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}






exports.getFilteredPosts = async (req, res) => {
  try {
    const { country, minAge, maxAge } = req.body;

    const filteredProfiles = await Profile.findAll({
      where: {
        [Op.and]: [
          {
            MinAgePreference: {
              [Op.lte]: minAge 
            },
          },
          {
            MaxAgePreference: {
              [Op.gte]: maxAge
            },
          },
        ],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'email', 'password'],
      },
      include: [
        {
          model: BestMatch,
          where: {
            country: country
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'email']
          }
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      filteredProfiles,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};









exports.getSingleBestMatch = async (req, res) => {
  try {
    const { id,currentLng,currentLat } = req.query;

    const singleMatch = await BestMatch.findOne({
      where: {
        id: id, // Assuming the foreign key for User is UserId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['createdAt', 'updatedAt',"email","password"],
          },
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
            {
              model: Hobbies,
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });

    const matchLat = singleMatch.latitude; 
    const matchLng = singleMatch.longitude; 

    // Calculate the distance using geolib library
    const distanceInMeters = geolib.getDistance(
      { latitude: currentLat, longitude: currentLng },
      { latitude: matchLat, longitude: matchLng }
    );

    const distanceInKm = Math.floor(distanceInMeters / 1000);


    if (!singleMatch) {
      
      return res.status(404).json({
        status: 'fail',
        message: 'No matching data found for the given user ID.',
      });
    }

    res.status(200).json({
      status: 'success',
      singleMatch,
      distance: distanceInKm,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching data.',
    });
  }
};

//update the Like status
exports.updateLikeStatus = async (req, res) => {
  try {
    const { id, liked, likerId } = req.body;
    let likedBy = await BestMatch.findOne({
      where: {
        id: id,
      },
      attributes: ['likedBy'],
    });

    if (likedBy) {
      likedBy = likedBy.likedBy || [];

      if (liked) {
        if (!likedBy.includes(likerId)) {
          likedBy.push(likerId);
        }
      } else {
        likedBy = likedBy.filter(userId => userId !== likerId);
      }

      const updatedLikeStatus = await BestMatch.update(
        {
          likedBy: likedBy,
          Liked: liked,
        },
        {
          where: {
            id: id,
          },
        }
      );

      res.status(200).json({
        status: 'success',
        updatedLikeStatus,
      });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating data.',
    });
  }
}


//update the Favourite status
exports.updateFavouriteStatus = async (req, res) => {
  try {
    const { id, favourite, favourerId } = req.body; // Assuming favourerId is the ID of the user who favorited
    
    let favouritedBy = await BestMatch.findOne({
      where: { id: id },
      attributes: ['FavouritedBy'],
    });

    if (favouritedBy) {
      favouritedBy = favouritedBy.FavouritedBy || [];

      if (favourite) {
        if (!favouritedBy.includes(favourerId)) {
          favouritedBy.push(favourerId);
        }
      } else {
        favouritedBy = favouritedBy.filter(userId => userId !== favourerId);
      }

      const updatedFavouriteStatus = await BestMatch.update(
        {
          FavouritedBy: favouritedBy,
          Favourite: favourite,
        },
        {
          where: { id: id },
        }
      );

      res.status(200).json({
        status: 'success',
        updatedFavouriteStatus,
      });
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating data.',
    });
  }
}


//////// get liked users
exports.GetBasedLikedStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    const likedUsers = await BestMatch.findAll({
      where: {
        likedBy: {
          [Op.contains]: [parseInt(userId, 10)],
        },
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "email", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).json({
      status: 'success',
      likedUsers,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving liked users.',
    });
  }
}




exports.GetBasedFavouriteStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    let startIndex = ((req.query.page * 5) - 5);
    const favouritePosts = await BestMatch.findAll({
      where: {
        Favourite: true,
        FavouritedBy: {
          [Op.contains]: [parseInt(userId, 10)],
        },
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "email", "password"],
          },
        },
      ],
      limit: 5,
      offset: startIndex,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.status(200).json({
      status: 'success',
      FavouritePosts: favouritePosts
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while retrieving favorite posts.',
    });
  }
}
