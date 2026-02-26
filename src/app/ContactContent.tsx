"use client";

import React from "react";

export default function ContactContent() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Facebook link */}
      <a
        href="https://www.facebook.com/profile.php?id=100057498187436"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "0.5rem",
          backgroundColor: "#1877F2",
          color: "#fff",
          padding: "0.55rem 1.25rem",
          borderRadius: "9999px",
          fontSize: "0.88rem",
          fontWeight: 600,
          fontFamily: "'Lato', sans-serif",
          textDecoration: "none",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
        Find us on Facebook
      </a>

      {/* Map embed */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          marginTop: "1.5rem",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--clr-border)",
          boxShadow: "0 4px 20px rgba(26,46,59,0.08)",
        }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1184.7223392687968!2d-0.05998846000675295!3d53.567679978086986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTPCsDM0JzAzLjciTiAwwrAwMycyNy43Ilc!5e0!3m2!1sen!2suk!4v1772066892451!5m2!1sen!2suk"
          width="100%"
          height="300"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Freeston Tots location"
        />
      </div>

      {/* Address */}
      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "var(--clr-text-muted)",
          fontFamily: "'Lato', sans-serif",
          textAlign: "center",
        }}
      >
        Rear of 1 Freeston Street, Cleethorpes, DN35 7LY
      </p>
    </div>
  );
}
