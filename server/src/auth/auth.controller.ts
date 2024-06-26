import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus, Param,
    Post, Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./auth.dto";
import {CreateUserDto} from "../users/users.dto";
import {RtGuard} from "../guards/rtGuard";
import {GetCurrentUser} from "../decorators/get-current-user";
import {GetCurrentUserEmail} from "../decorators/get-current-user-id.decorator";
import {AtGuard} from "../guards/atGuard";
import { Response } from 'express';
import {REDIRECT_ACTIVATION_URL} from "../constants";
import {ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {AuthResponseDto, RefreshTokenDto} from "./auth.types";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @ApiOperation({summary: "Логин пользователя, возвращает JWT refresh и access token"})
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthResponseDto,
        description: "Получен JWT refresh, access token и информация о пользователе",
        schema: {
            example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI...',
                user: {}
            }
        }
    })
    @ApiBody({
        description: "Данные для логина пользователя",
        type: LoginDto,
        examples: {
            a: {
                summary: 'Пример валидного запроса',
                value: {
                    email: "user@example.com",
                    password: "strong_password123"
                },
            },
        },
    })
    @Post("/login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @ApiOperation({summary: "Регистрация пользователя, возвращает JWT refresh и access token"})
    @ApiResponse({
        status: HttpStatus.OK,
        type: AuthResponseDto,
        description: "Получен JWT refresh, access token и информация о пользователе"})
    @ApiBody({
        description: "Данные для регистрации пользователя",
        type: CreateUserDto,
        examples: {
            a: {
                summary: 'Пример 1',
                value: {
                    email: "user@example.com",
                    password: "strong_password123",
                    name: "John",
                    surname: "Doe"
                },
            },
        },
    })
    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: CreateUserDto){
        return await this.authService.register(registerDto)
    }


    @ApiOperation({summary: "Обновляет Access JWT токен пользователя по его Refresh JWT токену, возвращает новые JWT refresh и access token"})
    @ApiResponse({status: HttpStatus.OK, type: RefreshTokenDto, description: "Получен JWT refresh, access token и информация о пользователе"})
    @UseGuards(RtGuard)
    @Post("/refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(
        @GetCurrentUserEmail() email: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    )
    {
        return this.authService.refreshTokens(email, refreshToken)
    }

    @ApiOperation({summary: "Удаляет Refresh JWT токен пользователя"})
    @ApiResponse({status: HttpStatus.OK, type: RefreshTokenDto, description: "JWT Refresh токен успешно удален"})
    @UseGuards(AtGuard)
    @Post("/logout")
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserEmail() email: string){
        return await this.authService.logout(email)
    }

    @ApiOperation({summary: "Активирует аккаунт пользователя по его токену активации"})
    @ApiResponse({status: HttpStatus.OK, type: RefreshTokenDto, description: "Аккаунт пользователя успешно активирован"})
    @Get("/activate/:token")
    async activate(@Param('token') token: string, @Res() res: Response){
        await this.authService.activateAccount(token)
        return res.redirect(REDIRECT_ACTIVATION_URL);
    }

    @ApiOperation({summary: "Отправляет письмо на почту пользователя с ссылкой для восстановления пароля"})
    @ApiResponse({status: HttpStatus.OK, type: RefreshTokenDto, description: "Письмо успешно отправлено"})
    @HttpCode(HttpStatus.OK)
    @Get("/forgot")
    async remindPassword(@Body() email: string){
        await this.authService.remindPassword(email)
    }

    @ApiOperation({summary: "Обновляет пароль пользователя по его Reset токену"})
    @ApiResponse({status: HttpStatus.OK, type: RefreshTokenDto, description: "Пароль пользователя успешно обновлен"})
    @HttpCode(HttpStatus.OK)
    @Post("/reset/:token")
    async resetPassword(@Param( 'token') token: string, @Body() body: {password: string}){
        const user = await this.authService.checkResetPasswordToken(token)
        await this.authService.resetPassword(user.email, body.password)
    }
}
