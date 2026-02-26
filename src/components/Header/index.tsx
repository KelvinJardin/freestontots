"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "About", href: "#About" },
  { label: "Open Times", href: "#Open-Times" },
  { label: "Gallery", href: "#Gallery" },
  { label: "Contact", href: "#Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      if (window.scrollY > 10) setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || menuOpen ? "var(--clr-bg)" : "transparent",
        boxShadow: scrolled || menuOpen
          ? "0 2px 16px rgba(91,184,232,0.18)"
          : "none",
        borderBottom: scrolled || menuOpen
          ? "2px solid var(--clr-primary)"
          : "none",
      }}
    >
      {/* Main bar */}
      <div
        className="mx-auto px-6 sm:px-4 flex items-center justify-between"
        style={{ height: 64, maxWidth: 1200 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="relative overflow-hidden rounded-full transition-all duration-200"
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              border: scrolled || menuOpen
                ? "2px solid var(--clr-primary)"
                : "2px solid var(--clr-border)",
            }}
          >
            <Image
              src="/images/img_logo.png"
              fill
              sizes="40px"
              alt="Freeston Tots Logo"
              className="object-cover"
            />
          </div>
          <span
            className="font-bold font-inter"
            style={{
              fontSize: "1.05rem",
              fontFamily: "'Nunito', sans-serif",
              color: scrolled || menuOpen ? "var(--clr-text)" : "#fff",
              fontWeight: 800,
            }}
          >
            Freeston Tots
          </span>
        </Link>

        {/* Desktop Nav — hide on <=1050px */}
        <nav className="flex items-center gap-8 md:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-medium transition-colors"
              style={{
                fontSize: "0.875rem",
                fontFamily: "'Lato', sans-serif",
                color: scrolled ? "var(--clr-text-muted)" : "rgba(255,255,255,0.9)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "var(--clr-primary)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = scrolled
                  ? "var(--clr-text-muted)"
                  : "rgba(255,255,255,0.9)")
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — show on <=1050px */}
        <button
          className="hidden md:flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg transition-colors"
          style={{
            width: 40,
            height: 40,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className="block rounded-full transition-all duration-200 origin-center"
            style={{
              width: 20,
              height: 2,
              backgroundColor: scrolled || menuOpen ? "var(--clr-text)" : "#fff",
              transform: menuOpen ? "rotate(45deg) translate(2px, 6px)" : "none",
            }}
          />
          <span
            className="block rounded-full transition-all duration-200"
            style={{
              width: 20,
              height: 2,
              backgroundColor: scrolled || menuOpen ? "var(--clr-text)" : "#fff",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block rounded-full transition-all duration-200 origin-center"
            style={{
              width: 20,
              height: 2,
              backgroundColor: scrolled || menuOpen ? "var(--clr-text)" : "#fff",
              transform: menuOpen ? "rotate(-45deg) translate(2px, -6px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown — only visible on <=1050px */}
      <div
        className="hidden md:block overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "var(--clr-bg)",
          maxHeight: menuOpen ? "280px" : "0",
          borderTop: menuOpen ? "1px solid var(--clr-border)" : "none",
        }}
      >
        <nav className="px-6 py-2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center py-3 font-medium border-b last:border-0 transition-colors"
              style={{
                fontSize: "0.95rem",
                fontFamily: "'Lato', sans-serif",
                color: "var(--clr-text-muted)",
                borderColor: "var(--clr-border)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "var(--clr-primary)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "var(--clr-text-muted)")
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
