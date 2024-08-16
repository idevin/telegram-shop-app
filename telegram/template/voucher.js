module.exports = {
    voucherMessage: function (voucherCode) {

        console.log("Voucher", voucherCode);

        return `
Here's a free voucher code for you to test out TeleShop: <b><u>${voucherCode}</u></b>
`
    }
}