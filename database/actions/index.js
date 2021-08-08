const Models = require("../models")
const { Op } = require("sequelize")


module.exports = {
    createOrder: async function (userID, shopID) {
        return await Models.Order.create({
            userID: userID,
            shopID: shopID
        })
    },
    createCart: async function (orderID, productID, quantity) {
        return await Models.Cart.create({
            orderID: orderID,
            productID: productID,
            quantity: quantity
        })
    },
    getCartByProductOrder: async function (orderID, productID) {
        return await Models.Cart.findOne({
            where: {
                orderID: orderID,
                productID: productID
            }
        })
    },
    getPendingOrderByUser: async function (shopID, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Order,
                where: {
                    userID: userID,
                    status: { [Op.eq]: "PENDING" }
                }
            }]
        })
        return data.Orders[0]
    },
    getProductByName: async function (shopID, productName) {
        const data = await Models.Category.findOne({
            where: { shopID: shopID },
            include: [{
                model: Models.Product,
                where: { name: productName }
            }]
        })
        return data.Products[0]
    },
    getProductByCategory: async function (shopID, categoryName) {
        const data = await Models.Category.findOne({
            where: {
                name: categoryName,
                shopID: shopID
            },
            include: [{
                model: Models.Product,
            }]
        })
        return data.Products
    },
    getCategoryByShop: async function (shopID) {
        return await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product
                }]
            }]
        })
    },
    getPendingCartByCategory: async function (shopID, categoryName, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                where: { name: categoryName },
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: userID,
                            status: "PENDING",
                        },
                        required: true,
                        through: {
                            attributes: ["quantity"],
                            where: { quantity: { [Op.ne]: 0 } },     // Retrieve orders that has a quantity
                        }
                    }],
                }]
            }]
        })
        return data.toJSON().Categories[0].Products
    },
    getPendingCartByShopID: async function (shopID, userID) {
        const data = await Models.Shop.findOne({
            where: { botID: shopID },
            include: [{
                model: Models.Category,
                include: [{
                    model: Models.Product,
                    include: [{
                        model: Models.Order,
                        where: {
                            userID: userID,
                            status: "PENDING",
                        },
                        required: true,
                        through: {
                            attributes: ["quantity"],
                            where: { quantity: { [Op.ne]: 0 } },     // Retrieve orders that has a quantity
                        }
                    }],
                }]
            }]
        })
        return data.Categories
    },
    getVoucherByCode: async function (shopID, voucherCode) {
        return await Models.Voucher.findOne({
            where: {
                shopID: shopID,
                code: voucherCode,
                isValid: true
            },
            include: [{
                model: Models.User,
            }]
        })
    },
    createVoucherUser: async function(voucherID, userID) {
        return await Models.VoucherUser.create({
            voucherID: voucherID,
            isClaimed: true,
            userID: userID
        })
    }
}