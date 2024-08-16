import Card from "../components/card"
import {getCategoryByShop} from "@/database/actions";

let shopID = process.env.SHOP_ID

let categories = getCategoryByShop(shopID)

console.log(categories)

export default function Categories() {
    return (
        <Card>
           
        </Card>
        )
}