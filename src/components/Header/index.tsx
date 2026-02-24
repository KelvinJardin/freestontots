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
      className="sticky top-0 z-50 transition-shadow duration-200"
      style={{
        backgroundColor: "#fff",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "0 1px 0 #f1f5f9",
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
            className="relative overflow-hidden rounded-full"
            style={{ width: 40, height: 40, flexShrink: 0, border: "2px solid #e0f2fe" }}
          >
            <Image
              src="/images/img_logo.png"
              fill
              sizes="40px"
              alt="Freeston Tots Logo"
              className="object-cover"
            />
          </div>
          <span className="font-bold text-gray-800 font-inter" style={{ fontSize: "1.05rem" }}>
            Freeston Tots
          </span>
        </Link>

        {/* Desktop Nav — hide on ≤1050px */}
        <nav className="flex items-center gap-8 md:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-gray-500 hover:text-sky-500 font-medium transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — show on ≤1050px */}
        <button
          className="hidden md:flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ width: 40, height: 40 }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            className="block bg-gray-700 rounded-full transition-all duration-200 origin-center"
            style={{
              width: 20,
              height: 2,
              transform: menuOpen ? "rotate(45deg) translate(2px, 6px)" : "none",
            }}
          />
          <span
            className="block bg-gray-700 rounded-full transition-all duration-200"
            style={{ width: 20, height: 2, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block bg-gray-700 rounded-full transition-all duration-200 origin-center"
            style={{
              width: 20,
              height: 2,
              transform: menuOpen ? "rotate(-45deg) translate(2px, -6px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown — only visible on ≤1050px */}
      <div
        className="hidden md:block overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "#fff",
          maxHeight: menuOpen ? "280px" : "0",
          borderTop: menuOpen ? "1px solid #f1f5f9" : "none",
        }}
      >
        <nav className="px-6 py-2">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center py-3 text-gray-600 hover:text-sky-500 font-medium border-b border-gray-50 last:border-0 transition-colors"
              style={{ fontSize: "0.95rem" }}
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
