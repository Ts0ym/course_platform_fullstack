export interface IUser {
    _id: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    balance: number;
    avatar: string;
}

export interface IUserInfo{
    _id:         string;
    name:        string;
    surname:     string;
    email:       string;
    role:        string;
    balance:     string;
    isActivated: string;
    avatar:      string;
    socialLinks: string[];
    aboutMe:     string;
}

export interface UpdateUserDto{
    email?: string;
    avatar?: File;
    aboutMe?: string;
    socialLinks?: string[];
    name?: string;
    surname?: string;
}