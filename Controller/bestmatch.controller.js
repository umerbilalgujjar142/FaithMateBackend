const db = require("../Model");
const User = db.user;
const BestMatch = db.bestmatch;
const geolib = require('geolib');
const { Op, Sequelize } = require("sequelize");
const sequelize = db.sequelize;
const Profile = db.profile;
const Hobbies = db.hobbies;




exports.bestMatch = async (req, res) => {
  try {
   
    const uploadstatus = await BestMatch.create({
      Image: req.file.filename,
      location: req.body.location,
      userId: req.body.userId,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      
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
    const { gender, distance, city } = req.query;

    const distanceInMeters = parseFloat(distance) * 1000;

    const filteredPosts = await User.findAll({
      where: {
        gender: gender, // Apply gender filter
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt',"email","password"],
      },
      include: [
        {
          model: BestMatch,
          where: {
            location: city,
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    });

    const postsWithinDistance = filteredPosts.filter(user => {
      const bestMatch = user.BestMatch;
      const imageDistance = geolib.getDistance(
        {
          latitude: parseFloat(bestMatch.latitude),
          longitude: parseFloat(bestMatch.longitude),
        },
        {
          latitude: parseFloat(req.query.latitude),
          longitude: parseFloat(req.query.longitude),
        }
      );

      return imageDistance <= distanceInMeters;
    });

    res.status(200).json({
      status: 'success',
      postsWithinDistance,
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
    const { id, liked } = req.query;

    const updatedLikeStatus = await BestMatch.update(
      {
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
    const { id, favourite } = req.query;

    const updatedFavouriteStatus = await BestMatch.update(
      {
        Favourite: favourite,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      status: 'success',
      updatedFavouriteStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating data.',
    });
  }
}



exports.GetBasedLikedStatus = async (req, res) => {
try {
    const { userId } = req.query;
    let startIndex = ((req.query.page * 5) - 5);
    const allImages = await BestMatch.findAll({
      where: {
        Liked: true,
        userId: userId,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt","email","password"],
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
      LikedUser: allImages
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}

exports.GetBasedFavouriteStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    let startIndex = ((req.query.page * 5) - 5);
    const allImages = await BestMatch.findAll({
      where: {
        Favourite: true,
        userId: userId,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt","email","password"],
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
      FavouriteUser: allImages
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
}