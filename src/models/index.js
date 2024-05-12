
const { dbUser, dbPassword, dbDatabase, dbDialect,
    dbPoolMax, dbPoolMin, dbPoolAcquire, dbPoolIdle, dbHost } = require('../config/config');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbDatabase, dbUser, dbPassword, {
    host: dbHost,
    dialect: dbDialect,
    operatorsAliases: 0,
    logging: console.log,
    define: {
        timestamps: true
    },
    pool: {
        max: parseInt(dbPoolMax, 5),
        min: parseInt(dbPoolMin, 0),
        acquire: parseInt(dbPoolAcquire, 30000),
        idle: parseInt(dbPoolIdle, 10000)
    }
});

const db = {};

//db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.comm = require("./Comm")(sequelize, Sequelize);
db.commmsg = require("./CommMsg")(sequelize, Sequelize);
db.doctor  = require("./Doctor")(sequelize, Sequelize);
db.users=require("./Users")(sequelize,Sequelize);
db.weeklyroster = require("./WeeklyRoster") (sequelize, Sequelize);
module.exports = db;