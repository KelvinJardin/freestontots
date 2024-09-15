import React, { ReactNode } from "react";
import "@/styles/tailwind.css";
import "../styles/index.css";
import "../styles/font.css";

function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="theme-color" content="#000000"/>
                <link rel="manifest" href="/manifest.json"/>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
            </head>
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
