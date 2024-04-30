import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
const bcrypt = require('bcryptjs');
import {CreateUserDto} from "../users/users.dto";
import {LoginDto} from "./auth.dto";
import {JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY} from "../constants";
import {MailService} from "../mail/mail.service";
import {v4 as uuidv4} from "uuid";

export type Tokens = {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private mailService: MailService
    ){}

    async validateUser(payload: any){
        const {email, password} = payload
        const user = await this.usersService.findOne(email)

        if(user && await bcrypt.compare(password, user.password)){
            return user
        }

        return null
    }

    async login(dto: LoginDto){
        const user = await this.usersService.findOne(dto.email)
        if(!user || !await bcrypt.compare(dto.password, user.password)){
            throw new HttpException('Некорректные данные для входа', HttpStatus.UNAUTHORIZED)
        }
        const tokens = await this.getTokens(user.email, user.role)
        await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)
        return {...tokens, user}
    }

    async register(dto: CreateUserDto){
        const candidate = await this.usersService.findOne(dto.email)
        if(candidate){
            throw new HttpException('Данный email уже зарегистрирован', HttpStatus.BAD_REQUEST)
        }

        const user= await this.usersService.createUser(dto)
        const tokens = await this.getTokens(user.email, user.role)
        await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)
        const activationToken = user.activationToken
        this.mailService.sendActivationEmail(user.email, activationToken)

        return {...tokens, user}
    }

    async refreshTokens(email: string, refreshToken: string){
        const user = await this.usersService.findOne(email)
        if(!user || user.refreshToken!== refreshToken) throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED)
        const tokens = await this.getTokens(user.email, user.role)
        await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken)
        return {...tokens, role: user.role}
    }

    async activateAccount(activationToken: string){
        const user = await this.usersService.findUserWithActivationToken(activationToken)
        if(!user) throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED)
        user.isActivated = true
        await user.save()
        return user
    }

    async logout(email: string){
        return await this.usersService.deleteRefreshToken(email)
    }

    async getTokens(email: string, role: string) : Promise<Tokens>{
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({email, role}, {expiresIn: '1d', secret: JWT_ACCESS_SECRET_KEY}),
            this.jwtService.signAsync({email, role}, {expiresIn: '7d', secret: JWT_REFRESH_SECRET_KEY})
        ]);
        return {
            accessToken,
            refreshToken
        }
    }
    async updateRefreshToken(email: string, refreshToken: string){
        await this.usersService.updateRefreshToken(email, refreshToken)
    }

    async remindPassword(email: string){
        const user = await this.usersService.findOne(email)
        if(!user ||!user.isActivated) throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED)
        const resetToken = uuidv4()
        user.resetPasswordToken = resetToken
        await user.save()
        this.mailService.sendResetPasswordEmail(user.email, resetToken)
    }

    async checkResetPasswordToken(resetToken: string){
        const user = await this.usersService.findUserWithResetPasswordToken(resetToken)
        if(!user) throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED)
        return user
    }

    async resetPassword(email: string, password: string){
        const user = await this.usersService.findOne(email)
        if(!user) throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED)
        user.password = password
        user.resetPasswordToken = null
        await user.save()
    }
}
