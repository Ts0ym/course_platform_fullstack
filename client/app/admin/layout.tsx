import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'Администрирование',
    description: "Администрирование платформой",
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>){
    return (children)
}