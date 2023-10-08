'use strict';
import Sequelize from 'sequelize';

import process from 'process';

const env = process.env.NODE_ENV || 'development';

import sequelizeConfig from '../config/config.json' assert { type: 'json' };
const config = sequelizeConfig[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
        database: 'htyvbot',
        host: '127.0.0.1',
        dialect: 'mariadb',
        logging: (str) => {
            console.log('LOG:: ', str);
        }
    });
}

sequelize
    .authenticate()
    .then(() =>
        console.log(
            '/app/models/connection.js::successfully connected to database at ' +
                env +
                ' environment'
        )
    )
    .catch((err) => console.error('/app/models/connection.js::Connection error: ', err));

export default sequelize;
