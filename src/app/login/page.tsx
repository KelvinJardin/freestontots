import { auth } from "@/app/auth";
import { GoogleSignIn as Login, Logout } from "@/components/Auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function() {
    const session = await auth();

    const authed = session?.user;

    const authButton = authed ? <Logout/> : <Login/>;
    const userName = session?.user?.name;

    return (<>
        {userName && <p>Hello, {userName}</p>}
        {authButton}
    </>);
}
