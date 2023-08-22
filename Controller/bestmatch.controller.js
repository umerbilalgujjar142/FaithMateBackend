const db = require("../Model");
const User = db.user;
const BestMatch = db.bestmatch;
const geolib = require('geolib');
const { Op, Sequelize } = require("sequelize");
const sequelize = db.sequelize;




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
    const { latitude, longitude } = req.query;

    const allImages = await BestMatch.findAll();

    const imagesWithinRadius = allImages.filter(image => {
      const distance = geolib.getDistance(
        { latitude: parseFloat(image.latitude), longitude: parseFloat(image.longitude) },
        { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
      );
      return distance <= 25000; // 25km in meters
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
        exclude: ['createdAt', 'updatedAt'],
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