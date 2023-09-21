module.exports = (Sequelize, sequelize) => {
    
    const BestMatch = sequelize.define('BestMatch', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        location: {
            type: Sequelize.STRING,
            allowNull: true
        },
        longitude: {
            type: Sequelize.STRING,
            allowNull: true
        },
        latitude: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Liked: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        Favourite: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        },
    
    });
    return BestMatch;



}