const { Markup } = require("telegraf")
const moment = require("moment")


module.exports = {
    dateWelcomeMessage: function () {
        return `
Just two more steps before we're able to generate your invoice! 🙂
`
    },
    dateMenuButtons: function () {
        const extra = Markup
            .keyboard([
                ["🏠 Back to Home"]
            ])
            .resize()
        extra.parse_mode = "HTML"
        return extra
    },
    calendarMessage: function () {
        return `
Kindly select your preferred delivery date 🚚
`
    },
    dateConfirmationMessage: function (date) {
        return `
You've selected <b>${moment(date, "DD-MM-YYYY").format("DD-MM-YYYY")}</b>. Are you sure?
`
    },
    dateConfirmationButtons: function () {
        return Markup.inlineKeyboard([
            [
                { text: "Confirm ✅", callback_data: "Yes" },
                { text: "Cancel ❌", callback_data: "No" },
            ],
        ])
    },
    cancelDateMessage: function () {
        return `
You have just cancelled your selection. Please choose another date.
`
    },
}