const {Markup} = require("telegraf")


module.exports = {
    welcomeMessage: function (ctx) {

        return `
            Welcome to <b>${ctx.botInfo.first_name}</b>
        `
    },
    welcomeMenuButtons: function () {
        return Markup
            .keyboard([
                ["📚 Categories", "🛒 Cart"]
            ])
            .resize()
    },
}