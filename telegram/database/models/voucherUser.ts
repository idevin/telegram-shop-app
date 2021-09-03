import { DataTypes, Deferrable, Model } from "sequelize"
import { VoucherUserAttributes } from "database/interfaces"
import sequelize from "../index"
import Voucher from "./voucher"
import User from "./user"


interface VoucherUserCreationAttributes extends VoucherUserAttributes { }
interface VoucherUserInstance extends Model<VoucherUserAttributes, VoucherUserCreationAttributes>, VoucherUserAttributes {
    createdAt?: Date,
    updatedAt?: Date,
}

const VoucherUser = sequelize.define<VoucherUserInstance>(
    "VoucherUser",
    {
        isClaimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        voucherID: {
            type: DataTypes.UUID,
            references: {
                model: Voucher,
                key: "id",
            },
        },
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "telegramID",
            },
        },
    },
    {
        timestamps: true,
    }
)

export default VoucherUser
