module.exports = (Sequelize, sequelize) => {

    //add fun, food, movie,sport
    const Hobbies = sequelize.define('hobbies', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fun: {
            type: Sequelize.STRING,
            allowNull: false
        },
        food: {
            type: Sequelize.STRING,
            allowNull: false
        },
        movie: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sport: {
            type: Sequelize.STRING,
            allowNull: false
        },

    });
    return Hobbies;


}