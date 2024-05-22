import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ShopItem, ShopItemDocument} from "./shopItem.schema";
import {User, UserDocument} from "../users/users.schema";
import {Model} from "mongoose";

@Injectable()
export class ShopService {
    constructor(
        @InjectModel(ShopItem.name) private readonly shopItemModel: Model<ShopItemDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) {}

    async getItems(): Promise<ShopItem[]> {
        return this.shopItemModel.find().exec();
    }

    async purchaseItem(userId: string, itemId: string): Promise<void> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const item = await this.shopItemModel.findById(itemId).exec();
        if (!item) {
            throw new NotFoundException('Item not found');
        }

        if (user.balance < item.price) {
            throw new BadRequestException('Insufficient balance');
        }

        user.balance -= item.price;

        if (item.type === 'consultation') {
            user.consultationTokens += 1;
        }

        await user.save();
    }
}
