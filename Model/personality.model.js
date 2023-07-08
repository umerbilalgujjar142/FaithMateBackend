module.exports = (Sequelize, sequelize) => {

    const Personality = sequelize.define('personality', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fun: {
            type: Sequelize.STRING,
            allowNull: false
        },
        book: {
            type: Sequelize.STRING,
            allowNull: false
        },
        food: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        humor: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hobbies: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });

    return Personality;

}