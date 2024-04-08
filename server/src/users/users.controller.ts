import {Controller, Get, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {Roles, RolesGuard} from "../guards/roles.guard";

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiTags('Users')
    @ApiOperation({summary: "Получить информацию о всех пользователях"})
    @Get('/')
    async getAllUsers() {
        return this.usersService.getAll();
    }
}
