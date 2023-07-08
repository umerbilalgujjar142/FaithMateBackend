module.exports = (Sequelize, sequelize) => {
    
    const Profile = sequelize.define('profile', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Bio: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Age: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ProfileImage:{
            type: Sequelize.STRING,
            allowNull: true
        }

    });
    return Profile;

}