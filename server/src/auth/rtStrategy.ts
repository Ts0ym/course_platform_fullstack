import {ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {AuthService} from "./auth.service";
import {JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY} from "../constants";
import {JwtService} from "@nestjs/jwt";

export type JwtPayload = {
    email: string;
    role: string;
};

export type JwtPayloadWithRt = JwtPayload & {refreshToken: string};
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_REFRESH_SECRET_KEY,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload)
    {
        const authorizationHeader = req.headers['authorization'];
        const refreshToken = authorizationHeader?.replace('Bearer', '').trim();

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            ...payload,
            refreshToken,
        };
    }
}