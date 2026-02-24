import { auth } from "@/app/auth";
import { GoogleSignIn as Login, Logout } from "@/components/Auth";
import Link from "next/link";
import Image from "next/image";

export default async function LoginPage() {
  const session = await auth();
  const authed = session?.user;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          backgroundColor: "#fff",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
          padding: "2.5rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid #e0f2fe",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/img_logo.png"
            fill
            sizes="80px"
            alt="Freeston Tots Logo"
            className="object-cover"
          />
        </div>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1
            className="font-bold font-inter"
            style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "0.25rem" }}
          >
            Freeston Tots
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500 }}>
            Admin Portal
          </p>
        </div>

        <div style={{ width: "100%", borderTop: "1px solid #f1f5f9" }} />

        {authed ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {userImage && (
              <Image
                src={userImage}
                width={52}
                height={52}
                alt={userName ?? "User"}
                style={{ borderRadius: "50%", border: "2px solid #e0f2fe" }}
              />
            )}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                Hello, {userName}!
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.25rem" }}>
                You&apos;re signed in to the admin portal.
              </p>
            </div>
            <Logout />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <p style={{ color: "#64748b", fontSize: "0.88rem", textAlign: "center" }}>
              Sign in with your Google account to access the admin panel.
            </p>
            <Login />
          </div>
        )}

        <div style={{ width: "100%", borderTop: "1px solid #f1f5f9" }} />

        <Link
          href="/"
          style={{
            fontSize: "0.85rem",
            color: "#0ea5e9",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
