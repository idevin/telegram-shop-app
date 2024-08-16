import {Sequelize} from 'sequelize'

export const sqliteConfig = {
    production: {
        database: 'papa_food_db',
        dialect: 'sqlite' as 'sqlite',
        storage: '../database/db.sqlite',
        host: '127.0.0.1'
    }
};

const sequelize = new Sequelize('', '', '',
    sqliteConfig.production
)

export default sequelize