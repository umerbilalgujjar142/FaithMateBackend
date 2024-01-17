module.exports = (Sequelize, sequelize) => {
  const Subscription = sequelize.define("subscription", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    orderId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    paymentStatus: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    startDate:{
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate:{
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  return Subscription;
};
