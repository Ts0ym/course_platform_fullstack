import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Мои курсы",
    description: "Страница с курсами пользователя",
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>){
    return (children)
}