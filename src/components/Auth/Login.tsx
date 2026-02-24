"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export function GoogleSignIn() {
  return (
    <button
      onClick={() => signIn("google")}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.65rem",
        backgroundColor: "#fff",
        color: "#374151",
        padding: "0.7rem 1.25rem",
        borderRadius: 10,
        border: "1.5px solid #e2e8f0",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.15s, background-color 0.15s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#f8fafc";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      <Image src="/images/google.png" alt="Google" width={20} height={20} style={{ flexShrink: 0 }} />
      Continue with Google
    </button>
  );
}
