import {Body, Controller, Get, Post} from '@nestjs/common';
import {ShopService} from "./shop.service";

@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Get('items')
    async getItems() {
        return this.shopService.getItems();
    }

    @Post('purchase')
    async purchaseItem(@Body() purchaseDto: { userId: string, itemId: string }) {
        await this.shopService.purchaseItem(purchaseDto.userId, purchaseDto.itemId);
    }
}
