import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Каталог курсов",
    description: "Каталог курсов Momentum",
};

export default function PageLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>){
    return (children)
}