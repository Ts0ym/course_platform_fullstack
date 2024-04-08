import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {AuthService} from "./auth.service";
import {JWT_ACCESS_SECRET_KEY} from "../constants";
import {JwtPayload} from "./rtStrategy";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_ACCESS_SECRET_KEY,
        });
    }

    async validate(payload: JwtPayload) {
        return payload
    }
}