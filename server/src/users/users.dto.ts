export class CreateUserDto{
    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly password: string;
}

export class UpdateUserDto{
    avatar?: Express.Multer.File;
    aboutMe?: string;
    socialLinks?: string;
    name?: string;
    surname?: string;
}