import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import type {LinksFunction} from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({children}: { children: React.ReactNode }) {
    const firebaseConfig = {
        apiKey: "AIzaSyAPjppSvsK_LJ68EH6eLRPnIwIHKJ8N8ao",
        authDomain: "remercee-app-dashboard.firebaseapp.com",
        projectId: "remercee-app-dashboard",
        storageBucket: "remercee-app-dashboard.firebasestorage.app",
        messagingSenderId: "791290341387",
        appId: "1:791290341387:web:4b4e72cdf737b4ee9d7f0e",
        measurementId: "G-95Q8211GZC"
    };

    const app = initializeApp(firebaseConfig);
    getAnalytics(app);
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex flex-row">
                {children}
            </main>
        </div>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return <Outlet/>;
}
