"use client";

import Header from "@/components/Header";
import React from "react";

interface HomeProps {
  isAdmin?: boolean;
  onAddSection?: () => void;
}

export default function Home({ isAdmin, onAddSection }: HomeProps) {
  return (
    <div style={{ position: "relative" }}>
      {/* Header overlays hero */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Header isAdmin={isAdmin} onAddSection={onAddSection} />
      </div>

      {/* Hero — full viewport height */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-6"
        style={{
          minHeight: "100vh",
          backgroundImage: "url(/images/img_home.png)",
        }}
      >
        {/* Warm gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(45,36,25,0.55) 0%, rgba(200,105,58,0.35) 60%, rgba(74,139,110,0.4) 100%)",
          }}
        />

        {/* Decorative floating blobs */}
        <div
          className="absolute"
          style={{
            top: "12%",
            left: "8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "20%",
            right: "10%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
            filter: "blur(48px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "20%",
            left: "15%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: "rgba(200,105,58,0.15)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "25%",
            right: "18%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "rgba(74,139,110,0.12)",
            filter: "blur(36px)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 text-center animate-in"
          style={{ maxWidth: 720 }}
        >
          <h1
            className="animate-in sm:text-[2.2rem]"
            style={{
              fontSize: "4.5rem",
              lineHeight: 1.1,
              color: "#fff",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.35))",
              marginBottom: "1rem",
            }}
          >
            Welcome to Freeston Tots
          </h1>
          <p
            className="animate-in-delay-1 sm:text-lg"
            style={{
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "#fff",
              opacity: 0.9,
              fontFamily: "'Lato', sans-serif",
              filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))",
              marginBottom: "2.5rem",
            }}
          >
            Where Every Child Matters
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center sm:flex-col sm:items-center sm:gap-3 animate-in-delay-2">
            <a
              href="#Mission"
              className="font-semibold transition-all"
              style={{
                display: "inline-block",
                backgroundColor: "var(--clr-primary)",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                fontSize: "0.95rem",
                fontFamily: "'Lato', sans-serif",
                boxShadow: "0 4px 20px rgba(91,184,232,0.45)",
              }}
            >
              Learn More
            </a>
            <a
              href="#Contact"
              className="font-semibold transition-all"
              style={{
                display: "inline-block",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                fontSize: "0.95rem",
                fontFamily: "'Lato', sans-serif",
                border: "1.5px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(4px)",
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute scroll-bounce"
          style={{ bottom: 28, left: "50%", transform: "translateX(-50%)" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
