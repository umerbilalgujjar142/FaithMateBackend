module.exports = (Sequelize, sequelize) => {

    const UploadStatus = sequelize.define('UploadStatu', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Image: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Status: {
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
    }

    )
    return UploadStatus;

}
