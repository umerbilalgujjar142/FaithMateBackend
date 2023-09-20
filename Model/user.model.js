module.exports=(Sequelize,sequelize)=>{

    const User=sequelize.define("user",{
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        fullname:{
            type:Sequelize.STRING,
            allowNull:false
        },
        gender:{
            type:Sequelize.STRING,
            allowNull:false
        },
        email:{
            type:Sequelize.STRING,
            allowNull:false
        },
        password:{
            type:Sequelize.STRING,
            allowNull:false
        },
        profession:{
            type: Sequelize.STRING,
            allowNull: false
        },

    })
    return User;
}