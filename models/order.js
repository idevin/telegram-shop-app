const { Sequelize, DataTypes } = require("sequelize")
const db = require("../db")
const User = require("./user")
const Shop = require("./shop")


const Order = db.define(
	"Order",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
        userID: {
			type: DataTypes.INTEGER,
			references: {
				model: User,
				key: "telegramID",
			},
		},
        shopID: {
			type: DataTypes.INTEGER,
			references: {
				model: Shop,
				key: "botID",
			},
		},
        status: {
            type: Sequelize.ENUM,
            values: ["PENDING", "COMPLETED"],
            defaultValue: "PENDING",
            allowNull: false
        }
	},
	{
		timestamps: true,
	}
)

module.exports = Order
