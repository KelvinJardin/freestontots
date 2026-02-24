"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button
      onClick={() => signOut()}
      style={{
        width: "100%",
        backgroundColor: "#1e293b",
        color: "#fff",
        padding: "0.7rem 1.25rem",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: 500,
        fontFamily: "Inter, sans-serif",
        transition: "background-color 0.15s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1e293b")}
    >
      Sign Out
    </button>
  );
}
