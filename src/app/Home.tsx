import Header from "@/components/Header";
import React from "react";

export default function Home() {
  return (
    <div>
      <Header />
      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center bg-[url(/images/img_home.png)] bg-cover bg-center bg-no-repeat px-6"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center" style={{ maxWidth: 720 }}>
          <h1
            className="font-bold font-inter sm:text-[1.9rem]"
            style={{
              fontSize: "3.5rem",
              lineHeight: 1.15,
              color: "#fff",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
              marginBottom: "0.75rem",
            }}
          >
            Welcome to Freeston Tots
          </h1>
          <p
            className="font-inter sm:text-lg"
            style={{
              fontSize: "1.4rem",
              fontWeight: 400,
              color: "#fff",
              opacity: 0.92,
              filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))",
              marginBottom: "2.5rem",
            }}
          >
            Where Every Child Matters
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center sm:flex-col sm:items-center sm:gap-3">
            <a
              href="#About"
              className="font-semibold font-inter transition-all"
              style={{
                display: "inline-block",
                backgroundColor: "#0ea5e9",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                fontSize: "0.95rem",
                boxShadow: "0 4px 20px rgba(14,165,233,0.4)",
              }}
            >
              Learn More
            </a>
            <a
              href="#Contact"
              className="font-semibold font-inter transition-all"
              style={{
                display: "inline-block",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                fontSize: "0.95rem",
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
            stroke="rgba(255,255,255,0.7)"
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
