import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'Авторизация',
    description: "Страница регистрации и входа пользователя",
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>){
    return (children)
}