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
        background: "linear-gradient(135deg, #FFFBF4 0%, #FFF0D9 50%, #FFE2BE 100%)",
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
          boxShadow: "0 8px 40px rgba(200,105,58,0.12)",
          border: "1px solid var(--clr-border)",
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
            border: "3px solid var(--clr-primary)",
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
            style={{
              fontSize: "1.5rem",
              color: "var(--clr-text)",
              marginBottom: "0.25rem",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
            }}
          >
            Freeston Tots
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--clr-text-muted)",
              fontWeight: 500,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Admin Portal
          </p>
        </div>

        <div style={{ width: "100%", borderTop: "1px solid var(--clr-border)" }} />

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
                style={{ borderRadius: "50%", border: "2px solid var(--clr-border)" }}
              />
            )}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontWeight: 600,
                  color: "var(--clr-text)",
                  fontSize: "0.95rem",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Hello, {userName}!
              </p>
              <p
                style={{
                  color: "var(--clr-text-muted)",
                  fontSize: "0.82rem",
                  marginTop: "0.25rem",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
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
            <p
              style={{
                color: "var(--clr-text-muted)",
                fontSize: "0.88rem",
                textAlign: "center",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Sign in with your Google account to access the admin panel.
            </p>
            <Login />
          </div>
        )}

        <div style={{ width: "100%", borderTop: "1px solid var(--clr-border)" }} />

        <Link
          href="/"
          style={{
            fontSize: "0.85rem",
            color: "var(--clr-primary)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontFamily: "'Lato', sans-serif",
          }}
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
