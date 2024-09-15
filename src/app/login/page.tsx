import { auth } from "@/app/auth";
import { GoogleSignIn as Login, Logout } from "@/components/Auth";
import { PrismaClient } from '@prisma/client';
import { Button } from "@mui/material";

const prisma = new PrismaClient();

export default async function() {
    const session = await auth();

    const authed = session?.user;

    const authButton = authed ? <Logout/> : <Login/>;
    const userName = session?.user?.name;

    return (<>
        {userName && <p style={{margin: "1rem"}}>Hello, {userName}</p>}
        <Button
            href={'/'}
            style={{
                backgroundColor: "#0070f3",
                color: "#fff",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.25rem",
                margin: "1rem",
        }}
        >Home</Button>
        {authButton}
    </>);
}
