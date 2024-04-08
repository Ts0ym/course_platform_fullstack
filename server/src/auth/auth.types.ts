import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.schema";

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    user: User;
}

export class RefreshTokenDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}