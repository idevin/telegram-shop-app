const Models = require("../models")
const { Op } = require("sequelize")


module.exports = {
    createShop: async function (botID, shopName, ownerID, botToken) {
        return await Models.Shop.create({
            botID: botID,
            name: shopName,
            image: null,
            ownerID: ownerID,
            botToken: botToken,
        })
    },
    createOrder: async function (userID, shopID) {
        return await Models.Order.create({
            userID: userID,
            shopID: shopID,
        })
    },
    createCart: async function (orderID, productID, quantity) {
        return await Models.Cart.create({
            orderID: orderID,
            productID: productID,
            quantity: quantity,
        })
    },
    getCartByProductOrder: async function (orderID, productID) {
        return await Models.Cart.findOne({
            where: {
                orderID: orderID,
                productID: productID,
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
        return data ? data.Orders[0] : data
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
                shopID: shopID,
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
    createVoucherUser: async function (userID, voucherID) {
        return await Models.VoucherUser.create({
            voucherID: voucherID,
            isClaimed: true,
            userID: userID
        })
    },
    createNewPayment: async function (orderID, addressID) {
        return await Models.Payment.create({
            orderID: orderID,
            addressID: addressID
        })
    },
    getAddress: async function (userID, orderDetails) {
        return await Models.Address.findOne({
            where: {
                userID: userID,
                addressLineOne: orderDetails.lineOne,
                addressLineTwo: orderDetails.lineTwo,
                city: orderDetails.city,
                postalCode: orderDetails.postalCode,
                country: orderDetails.country,
                mobile: orderDetails.mobile
            }
        })
    },
    createAddress: async function (userID, orderDetails) {
        return await Models.Address.create({
            userID: userID,
            addressLineOne: orderDetails.lineOne,
            addressLineTwo: orderDetails.lineTwo,
            city: orderDetails.city,
            postalCode: orderDetails.postalCode,
            country: orderDetails.country,
            mobile: orderDetails.mobile
        })
    },
    getShopByID: async function (shopID) {
        return await Models.Shop.findOne({
            where: {
                botID: shopID
            }
        })
    },
    getUserByID: async function (userID) {
        return await Models.User.findOne({
            where: {
                telegramID: userID,
            }
        })
    },
    createUser: async function (telegramID, name) {
        return await Models.User.create({
            telegramID: telegramID,
            name: name,
        })
    },
    getChat: async function (shopID, userID) {
        return await Models.Chat.findOne({
            where: {
                shopID: shopID,
                userID: userID,
            }
        })
    },
    createChat: async function (shopID, userID, chatID) {
        return await Models.Chat.create({
            shopID: shopID,
            userID: userID,
            chatID: chatID,
        })
    },
}