const db = require("../Model");
const Subscription = db.subscription;
const { Op } = require("sequelize");

exports.userSubscription = async (req, res) => {
  try {
    const { plan, amount, orderId, paymentStatus,userId,endDate } = req.body;

    const subscription = await Subscription.create({
      plan: plan,
      amount: amount,
      orderId: orderId,
      paymentStatus: paymentStatus,
      userId: userId,
      startDate: new Date(),
      endDate: endDate,
    });
    res.status(201).json({
      status: "success",
      subscription: subscription,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const { userId, date } = req.query;

    // Find all subscriptions for the user
    const subscriptions = await Subscription.findAll({
      where: {
        userId: userId,
        endDate: {
          [Op.gte]: new Date(date), // Check if expirationDate is greater than or equal to the current date
        },
      },
      order: [['createdAt', 'ASC']],
      attributes: {
        exclude: ['amount', 'orderId', 'userId', 'updatedAt','startDate','createdAt'],
      },
    });

    if (subscriptions.length === 0) {
      res.status(201).json({
        status: 'failed',
        message: 'Please subscribe to a plan to view more content',
      });
    } else {
      res.status(200).json({
        status: 'success',
        subscriptions: subscriptions,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};
