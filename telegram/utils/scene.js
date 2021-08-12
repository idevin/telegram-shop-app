const _ = require("lodash")
const Template = require("../template")


module.exports = {
    initializeScene: function (ctx) {
        ctx.session.cleanUpState = []
        ctx.session.timeout = []
        ctx.session.isWaiting = {
            status: false
        }
    },
    cleanUpMessage: function (ctx, isObjectState, condition, update) {     // isObjectState to handle special cases in product scene
        if (ctx.session.cleanUpState) {                                    // Root page does not initialize cleanUpState
            for (const message of ctx.session.cleanUpState) {
                if (condition) {
                    if (condition.includes(message.type)) {
                        ctx.telegram.deleteMessage(ctx.chat.id, isObjectState ? message.id : message)
                    }
                } else {
                    ctx.telegram.deleteMessage(ctx.chat.id, isObjectState ? message.id : message)
                }
            }

            if (update) {           // Update clean up state to prevent deletion errors
                ctx.session.cleanUpState = _.filter(ctx.session.cleanUpState, function (message) {
                    if (!condition.includes(message.type)) {
                        return message
                    }
                })
            }
        }
    },
    updateCleanUpState: function (ctx, data) {
        if (ctx.session.cleanUpState && ctx.session.cleanUpState.length !== 0) {
            ctx.session.cleanUpState = _.concat(ctx.session.cleanUpState, data)
        } else {
            ctx.session.cleanUpState = [{
                id: data.id,
                type: data.type
            }]
        }
    },
    disableWaitingStatus: function (ctx) {
        ctx.session.isWaiting.status = false
    },
    isInputMode: function (ctx) {
        return ctx.session.isWaiting && ctx.session.isWaiting.status
    },
    getCartMessageByID: function (ctx) {
        return _.find(ctx.session.cleanUpState, function (o) {
            return o.type === "cart"
        }).id
    },
    getProductMessageID: function (ctx, productName) {
        return _.find(ctx.session.cleanUpState, function (o) {
            return o.productName === productName
        }).id
    },
    getCalendarMessageID: function (ctx) {
        return _.find(ctx.session.cleanUpState, function (o) {
            return o.type === "calendar"
        }).id
    },
    replaceCartMessageInState: function (ctx, data) {
        ctx.session.cleanUpState = _.map(ctx.session.cleanUpState, function (message) {         // Convert old cart message ID into text to prune
            if (message.type === "cart") {
                message.type = "user"
            }
            return message
        })
        module.exports.updateCleanUpState(ctx, data)
    },
    updateSystemMessageInState: function (ctx, message) {
        module.exports.updateCleanUpState(ctx, { id: message.message_id, type: "system" })
    },
    updateUserMessageInState: function (ctx, message) {
        module.exports.updateCleanUpState(ctx, { id: message.message_id, type: "user" })
    },
    clearTimeout: function (ctx) {
        for (const timeout of ctx.session.timeout) {
            clearTimeout(timeout)
        }
    },
    sendSystemMessage: async function (ctx, message, buttons) {
        const system = await ctx.replyWithHTML(message, buttons)
        module.exports.updateSystemMessageInState(ctx, system)
    },
    cancelInputMode: async function (ctx, message, timeout) {
        module.exports.disableWaitingStatus(ctx)
        await module.exports.sendSystemMessage(ctx, message)
        ctx.session.timeout.push(setTimeout(() => {
            module.exports.cleanUpMessage(ctx, true, ["system", "user"], true)
        }, timeout * 1000))
    },
    clearScene: async function (ctx, isObjectState) {
        if (ctx.session.timeout) {      // Not every scene contains timeout
            for (const timeout of ctx.session.timeout) {
                clearTimeout(timeout)
            }
        }
        module.exports.cleanUpMessage(ctx, isObjectState)
    },
    cancelDateInput: async function (ctx, message, timeout) {
        module.exports.disableWaitingStatus(ctx)
        await ctx.editMessageText(message, Template.htmlMode())
        ctx.session.timeout.push(setTimeout(() => {
            ctx.deleteMessage()
            ctx.session.cleanUpState = _.filter(ctx.session.cleanUpState, function (o) {
                return o ? o.id !== message.id : o
            })
        }, timeout * 1000))
    },
    sendCartMessage: async function (ctx, message, buttons) {
        const cart = await ctx.replyWithHTML(message, buttons)
        module.exports.updateCleanUpState(ctx, { id: cart.message_id, type: "cart" })
    },
    sendWelcomeMessage: async function (ctx, message, buttons) {
        const welcome = await ctx.replyWithHTML(message, buttons)
        module.exports.updateCleanUpState(ctx, { id: welcome.message_id, type: "welcome" })
    },
    checkForHomeButton: function (ctx, message) {
        if (message === "🏠 Back to Home") {
            ctx.scene.enter("WELCOME_SCENE")
        }
    }
}