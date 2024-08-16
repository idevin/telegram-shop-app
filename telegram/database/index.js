const {Sequelize} = require("sequelize")


const sequelize = new Sequelize(
    '', '', '',
    {
        database: 'papa_food_db',
        dialect: "sqlite",
        storage: "../database/db.sqlite",
        protocol: "sqlite"
    }
)

sequelize
    .authenticate()
    .then(async () => {
        console.log("Connection has been established successfully.")
        // await sequelize.sync({force: true})
    })
    .catch(error => console.log("Unable to connect to the database", error))

module.exports = sequelize
