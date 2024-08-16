import Models from "../models"


export const getCategoryByShop = async (shopID: string | number | undefined) => {
    return await Models.Category.findAll({
        where: {shopID: shopID},
    })
}

export default {
    getCategoryByShop
}