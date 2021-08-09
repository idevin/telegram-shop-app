const _ = require("lodash")
const { Markup } = require("telegraf")
const numeral = require('numeral')
const moment = require("moment")


module.exports = {
    welcomeMessage: function (shopName) {
        return `Welcome to <b>${shopName}</b>

insert shop description here

<i>Press a key on the bottom keyboard to select an option.</i>
<i>If the keyboard has not opened, you can open it by pressing the button with four small squares in the message bar.</i>
`
    },
    categoryMessage: function (body, shopName) {
        return body + `<i>🟢 - Available</i>
<i>🟡 - Low on stock</i>
<i>🔴 - Out of stock</i>

<i>Navigate to the individual category using the buttons below that <b>${shopName}</b> offers.</i>
`
    },
    indivCartMessage: function (cart) {
        var message = "🛒 Your cart contains the following products:\n\n"
        var totalCost = 0

        if (cart && cart.length !== 0) {
            _.forEach(cart, function (product) {
                const quantity = product.Orders[0].Cart.quantity
                const productCost = quantity * parseFloat(product.price)
                message += `${quantity}x ${product.name} - ${numeral(productCost).format("$0,0.00")}\n`
                totalCost += productCost
            })
        } else {
            message += "<i>You have yet to place any orders for this category.</i>\n"
        }

        message += `\nTotal cost: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        return message
    },
    overallCartMessage: function (cart, shopName, voucher) {
        var message = "🛒 Your cart contains the following products:\n\n"
        var totalCost = 0
        var savedCost = 0
        const initialLength = message.length
        var isEmpty = false

        for (const category of cart) {
            if (category.Products && category.Products.length !== 0) {
                message += `<b><u>${category.name} (${category.Products.length})</u></b>\n`
                for (const product of category.Products) {
                    const quantity = product.Orders[0].Cart.quantity
                    const productCost = quantity * product.price
                    const discount = voucher ? voucher.discount / 100 : 0

                    message += voucher
                        ? `${quantity}x ${product.name} - ${numeral(productCost * (1 - discount)).format("$0,0.00")} (-${numeral(productCost * discount).format("$0,0.00")})\n`
                        : `${quantity}x ${product.name} - ${numeral(productCost).format("$0,0.00")}\n`

                    totalCost += voucher ? (productCost * (1 - discount)) : productCost
                    savedCost += voucher ? (productCost * discount) : 0
                }
                message += "\n"
            }
        }

        if (message.length === initialLength) {     // No message between header and footer
            message += `<i>You have yet to place any orders in ${shopName}.</i>\n\n`
            isEmpty = true
        }

        message += `Total cost: <b>${numeral(totalCost).format("$0,0.00")}</b>`
        message += voucher
            ? `\nTotal savings: <b>${numeral(savedCost).format("$0,0.00")}</b>`
            : ""

        return [message, isEmpty]
    },
    paymentButtons: function () {
        const extra = Markup
            .keyboard([
                ["⭐ Apply Voucher Code"],
                ["💳 Proceed to Payment"],
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    cartButtons: function () {
        const extra = Markup.inlineKeyboard([
            [{ text: "⬅️ Back to Categories", callback_data: "GET /category" }],
            [{ text: "✅ Proceed to Checkout", callback_data: "GET /checkout" }]
        ])
        extra.parse_mode = "HTML"
        return extra
    },
    productCardMessage: function (product) {
        const caption = `
<b><u>${product.name}</u></b>

<i>${product.description}</i>

Price: <b>${numeral(product.price).format("$0,0.00")}</b>
Available Qty: <b>${product.quantity}</b>
`
        return caption
    },
    productButtons: function (categoryName, product, quantity) {
        console.log("Byte length: ", new TextEncoder().encode(`POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`).length)
        const extra = Markup.inlineKeyboard(
            [
                [
                    { text: "➖ Remove", callback_data: `POST /cart/${categoryName}/${product.name}/remove` },
                    { text: "➕ Add", callback_data: `POST /cart/${categoryName}/${product.name}/add` },
                ],
                [{
                    text: `Quantity: ${quantity.toString()}`,
                    callback_data: `POST /cart/${categoryName}/${product.name}/edit/?avai=${product.quantity}&?current=${quantity}`
                }]
            ],
        )
        extra.parse_mode = "HTML"
        extra.caption = module.exports.productCardMessage(product)
        return extra
    },
    inputQuantityMessage: function (available, current, productName) {
        return `
Kindly enter a number for your preferred quantity to place an order for <b>${productName}</b>.

Current quantity placed: <b>${numeral(current).format("0,0")}</b>
Available quantity for purchase: <b>${numeral(available).format("0,0")}</b>

<i>You are currently in a text only input mode.</i>
<i>Type 'cancel' to exit this mode.</i>
`
    },
    inputVoucherMessage: function (shopName) {
        return `
Have a voucher code for <b>${shopName}</b>?

Enter it right here and we'll apply it automatically into your cart.

<i>You are currently in a text only input mode.</i>
<i>Type 'cancel' to exit this mode.</i>
`
    },
    cancelQuantityInputMessage: function () {
        return `
You have successfully exited the text input mode.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
        `
    },
    invalidVoucherCode: function () {
        return `
This is an <b>invalid voucher</b> code! 

Please try again or contact the seller to verify the voucher.

<i>Note that voucher codes are case and symbols sensitive.</i>
<i>Type 'cancel' to exit this mode.</i>
`
    },
    inputSuccessMessage: function (productName, previous, current) {
        return `
You have successfully updated the quantity for <b>${productName}</b> from <b>${previous}</b> to <b>${current}</b>.

You can now continue browsing the catalogue and select the quantity by <b><i>toggling</i></b> the add/remove buttons.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
`
    },
    claimedVoucherCode: function (voucherCode, claimedAt) {
        const time = moment(claimedAt)
        return `
Are you sure this is the correct voucher code?

You have already claimed this voucher (<i>${voucherCode}</i>) on <b>${time.format("Do MMMM YYYY")}</b> at <b>${time.format("h:mm:ss a")}</b>!

<i>Type 'cancel' to exit this mode.</i>
`
    },
    voucherSuccessMessage: function (voucher) {
        return `
You have successfully applied <i>${voucher.code}</i> with <b>${voucher.discount}% discount</b> onto your cart.

You may now proceed to checkout by pressing on '💳 Proceed to Payment' button below.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
`
    },
    emptyCartMessage: function () {
        return `
Your cart is currently empty. There's nothing for the voucher to be applied on. 

Come back here again after adding items into your cart! 😊
`
    },
    checkoutErrorMessage: function () {
        return `
You currently do not have any items in your cart to checkout!

Perhaps, you're looking at the wrong place? 😶
`
    },

    cancelVoucherInputMessage: function () {
        return `
You have successfully exited the text input mode.

You may now proceed to checkout.

<i>This message will be deleted after 5 seconds for a better user experience. Please do not be startled. 😊</i>
        `
    },
    registrationSuccessMessage: function (userID, username, shopName) {
        return `
Congraluations <a href="tg://user?id=${userID}">@${username}</a>! You have just successfully setup ${shopName}. You may now proceed to XXX url to add products and configure your store!
`
    }
}