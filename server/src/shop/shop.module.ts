import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {ShopItem, ShopItemSchema} from "./shopItem.schema";
import {User, UserSchema} from "../users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopItem.name, schema: ShopItemSchema},
      { name: User.name, schema: UserSchema},
    ])
  ],
  providers: [ShopService],
  controllers: [ShopController]
})
export class ShopModule {}
