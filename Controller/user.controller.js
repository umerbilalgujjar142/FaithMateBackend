const jwt = require("jsonwebtoken");
const db = require("../Model");
const User = db.user;
const Personality = db.personality;
const Hobbies = db.hobbies;
const Profile = db.profile;
const UploadStatus = db.uploadstatus;
const geolib = require('geolib');


const bcrypt = require("bcrypt");
//get the nodemailer from midleware
const { sendEmailWithOTP, generateOTP, otpMap } = require("../Middleware/nodemailer.js");


exports.userRegister = async (req, res) => {
    try {
        const hash = await bcrypt.hashSync(req.body.password, 10); //for hash

        const user = await User.create({
            fullname: req.body.fullname,
            gender: req.body.gender,
            email: req.body.email,
            password: hash,
        });
        res.status(201).json({
            status: "success",
            user,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User not found",
            });
        }
        const isMatch = await bcrypt.compareSync(req.body.password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: "fail",
                message: "Incorrect password",
            });
        }
        const token = jwt.sign({ id: user.id }, 'FaithMate-secret-key');
        res.status(200).json({
            status: "success",
            user,
            token,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}

//////personality
exports.userPersonality = async (req, res) => {
    try {
        const personality = await Personality.create({
            fun: req.body.fun,
            book: req.body.book,
            food: req.body.food,
            dress: req.body.dress,
            humor: req.body.humor,
            hobbies: req.body.hobbies,
            userId: req.body.userId,
        });
        res.status(201).json({
            status: "success",
            personality,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}


exports.userHobbies = async (req, res) => {
    try {
        const { fun, food, sport, userId } = req.body;
    
        const user = await User.findByPk(userId);
        console.log("--->",user.id);
    
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "User not found.",
          });
        }
    
        // Create hobbies record and associate it with the user
        const hobbies = await Hobbies.create({
          fun: fun ? fun.split(',') : [], // Convert string to array
          food: food ? food.split(',') : [], // Convert string to array
          sport: sport ? sport.split(',') : [], // Convert string to array
          userId: user.id,
        });
    
        res.status(201).json({
          status: "success",
          hobbies,
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(400).json({
          status: "fail",
          message: "An error occurred while processing hobbies data.",
        });
      }
}

//userProfile
exports.AddProfileData = async (req, res) => {

    try {
        const profile = await Profile.create({
            Bio: req.body.bio,
            Age: req.body.age,
            ProfileImage:  req.file.filename,
            userId: req.body.userId,

        });
        res.status(201).json({
            status: "success",
            profile
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }

}

//upodateProfile
exports.UpdateProfileData = async (req, res) => {
    try {
        const { bio, age } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        const [updatedRows] = await Profile.update(
            {
                Bio: bio,
                Age: age,
                ProfileImage: profileImage,
            },
            {
                where: {
                    userId: 1,
                },
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Profile not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

//getProfile
exports.GetProfileData = async (req, res) => {
    try {
        const profile = await Profile.findOne({
          where: {
            userId: req.query.userId,
          },
        });
    
        if (!profile) {
          return res.status(404).json({
            status: 'fail',
            message: 'Profile data not found',
          });
        }
    
        res.status(200).json({
          status: 'success',
          data: profile,
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      }
}



exports.SendEmail = (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        otpMap.set(email, otp);
        req.email = email;
        req.generatedOTP = otp;

        sendEmailWithOTP(req, res, () => {
            const generatedOTP = req.generatedOTP;

            res.status(200).json({
                status: 'success',
                message: 'OTP sent successfully',
                generatedOTP,
            });


        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send email with OTP' });
    }
};

exports.VerifyOTP = (req, res, next) => {
    const { email, enteredOTP } = req.body;
    const sentOTP = otpMap.get(email);

    if (!sentOTP) {
        return res.status(400).json({ message: 'OTP not found' });
    }
    if (enteredOTP === sentOTP) {
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

}

exports.updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const [updatedRows] = await User.update(
            {
                password: hash,
            },
            {
                where: {
                    id: req.body.userId,
                },
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}



exports.uploadStatus = async (req, res) => {
    try {        
        const uploadstatus = await UploadStatus.create({
            Image: req.file.filename,
            Status: req.body.Status,
            longitude:req.body.longitude,
            latitude:req.body.latitude,
            userId: req.body.userId,
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
}
    

exports.getStatus = async (req, res) => {
    try {
        const { latitude, longitude } = req.query; 

        const allImages = await UploadStatus.findAll(); 

        const imagesWithinRadius = allImages.filter(image => {
            const distance = geolib.getDistance(
                { latitude: parseFloat(image.latitude), longitude: parseFloat(image.longitude) },
                { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
            );
            return distance <= 25000; // 25km in meters
        });

        res.status(200).json({
            status: "success",
            images: imagesWithinRadius
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

