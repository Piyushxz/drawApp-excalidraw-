"use client"
import {  ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function Providers({children}:{children:ReactNode}){
    return(
        <RecoilRoot>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </RecoilRoot>
    )
}