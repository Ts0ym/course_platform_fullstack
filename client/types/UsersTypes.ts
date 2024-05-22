import {ICourse, ITariff} from "@/types/CoursesTypes";

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
    consultationTokens: number;
}

export interface UpdateUserDto{
    email?: string;
    avatar?: File;
    aboutMe?: string;
    socialLinks?: string[];
    name?: string;
    surname?: string;
}

export interface fullUserData{
    _id:                 string;
    password:            string;
    name:                string;
    surname:             string;
    email:               string;
    role:                string;
    balance:             string;
    refreshToken:        string;
    isActivated:         string;
    activationToken:     string;
    resetPasswordToken:  null;
    lastVisitedLesson:   string;
    avatar:              string;
    aboutMe:             string;
    socialLinks:         string[];
    coursesWithProgress: CoursesWithProgress[];
}
export interface CoursesWithProgress {
    course:   ICourse;
    progress: number;
    startDate: string
    tariff: ITariff
}
