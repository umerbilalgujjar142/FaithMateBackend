const Sequelize=require('sequelize')
const config=require('../Config/db.config.js')
const sequelize=new Sequelize(config.dbname,config.user,config.password,{
    host:config.host,
    dialect:config.dialect
    })
const db={}

db.Sequelize=Sequelize;
db.sequelize=sequelize;


db.user=require('./user.model.js')(Sequelize,sequelize);
db.personality=require('./personality.model.js')(Sequelize,sequelize);
db.hobbies=require('./hobbies.model.js')(Sequelize,sequelize);
db.profile=require('./profile.model.js')(Sequelize,sequelize);
db.uploadstatus=require('./uploadstatus.model.js')(Sequelize,sequelize);
db.bestmatch=require('./bestmatch.model.js')(Sequelize,sequelize);


//user and personality relation
db.user.hasOne(db.personality,{foreignKey:'userId'});
db.personality.belongsTo(db.user,{foreignKey:'userId'});

//hobbies and user relation
db.user.hasOne(db.hobbies,{foreignKey:'userId'});
db.hobbies.belongsTo(db.user,{foreignKey:'userId'});

//profile and user relation
db.user.hasOne(db.profile,{foreignKey:'userId'});
db.profile.belongsTo(db.user,{foreignKey:'userId'});

//status and user relation
db.user.hasOne(db.uploadstatus,{foreignKey:'userId'});
db.uploadstatus.belongsTo(db.user,{foreignKey:'userId'});

//bestmatch and user relation
db.user.hasOne(db.bestmatch,{foreignKey:'userId'});
db.bestmatch.belongsTo(db.user,{foreignKey:'userId'});





module.exports=db;