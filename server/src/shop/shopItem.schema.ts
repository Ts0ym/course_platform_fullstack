import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'shop_items' })
export class ShopItem {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    price: number;  // Цена в монетах

    @Prop({required: true})
    type: string;  // Тип товара (например, 'consultation')

    @Prop({required: true})
    icon: string;
}

export type ShopItemDocument = ShopItem & Document;
export const ShopItemSchema = SchemaFactory.createForClass(ShopItem);