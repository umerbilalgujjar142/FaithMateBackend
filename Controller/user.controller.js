const jwt = require("jsonwebtoken");
const db = require("../Model");
const { Op } = require("sequelize");
const User = db.user;
const Personality = db.personality;
const Hobbies = db.hobbies;
const Profile = db.profile;
const bcrypt = require("bcrypt");

exports.userRegister = async (req, res) => {
    try {
        const hash =await bcrypt.hashSync(req.body.password, 10); //for hash

        const user = await User.create({
            fullname: req.body.fullname,
            gender:req.body.gender,
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

//userHobbies
exports.userHobbies = async (req, res) => {
    try {
        const hobbies = await Hobbies.create({
            fun: req.body.fun,
            food: req.body.food,
            movie: req.body.movie,
            sport: req.body.sport,
            userId: req.body.userId,
        });
        res.status(201).json({
            status: "success",
            hobbies,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}

//userProfile
exports.AddProfileData = async (req, res) => {

    try {
        const profile = await Profile.create({
            Bio: req.body.bio,
            Age: req.body.age,
            ProfileImage: req.file.filename,
            userId: req.body.userId,

        }, );
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
                userId: req.body.userId,
            },
            include: [
                {
                    model: User,
                },
            ],

        });
        res.status(201).json({
            status: "success",
            profile,
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}












