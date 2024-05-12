

const dotenv = require('dotenv');
const path = require('path')

console.log('Directory name ' + __dirname);
const envPath = path.resolve(__dirname, '../../.env.prod')
console.log('ENV path ' +envPath);

const result = dotenv.config({ path: envPath })
if (result.error) {
    throw result.error;
  }
const { parsed: envs } = result;
console.log(envs);

module.exports = {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    dbHost: process.env.DB_CONFIG_HOST,
    dbUser: process.env.DB_CONFIG_USER,
    dbPassword: process.env.DB_CONFIG_PASSWORD,
    dbDatabase: process.env.DB_CONFIG_DATABASE,
    dbDialect: process.env.DB_CONFIG_DIALECT,
    dbPoolMax: process.env.DB_CONFIG_POOL_MAX,
    dbPoolMin: process.env.DB_CONFIG_POOL_MIN,
    dbPoolAcquire: process.env.DB_CONFIG_ACQUIRE,
    dbPoolIdle: process.env.DB_CONFIG_IDLE
};