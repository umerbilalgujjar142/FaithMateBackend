module.exports = (Sequelize, sequelize) => {
    const Hobbies = sequelize.define('hobbies', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fun: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        },
        food: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        },
        movie: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        },
        sport: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        },
    });

    return Hobbies;
}
