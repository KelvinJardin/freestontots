'use client';

import { signIn } from "next-auth/react"
import Image from "next/image"

export function GoogleSignIn() {
    return (
        <button
            onClick={() => signIn("google")}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#4285F4',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
            }}
        >
            <Image src="/images/google.png" alt="Google Logo" width={20} height={20} />
            Continue with Google
        </button>
    );
}
