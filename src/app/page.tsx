import React from "react";
import { Metadata } from "next";

import PageClient from "@/app/PageClient";
import { auth } from "@/app/auth";
import prisma from "@/app/db";
import { Content } from "@prisma/client";

export const metadata: Metadata = {
  title: "Freeston Tots",
  description: "Freeston Tots Preschool"
};

// Headings that must always exist in the rendered page (created on first edit)
const REQUIRED_HEADINGS = ["About", "Mission", "Open Times", "Term Dates", "Blog", "Gallery", "Reviews", "Contact"];

export default async function FreestonTotsPage() {
  const session = await auth();
  const authed = session?.user;
  const user = authed
    ? await prisma.user.findFirst({ where: { id: authed?.id } })
    : null;

  // Fetch all content rows ordered by the `order` field
  const allContents = await prisma.content.findMany({
    orderBy: { order: "asc" },
  });

  const openTimes = await prisma.openTimes.findMany();
  const galleryImages = await prisma.galleryImage.findMany({ orderBy: { createdAt: "asc" } });

  // Blog: admins see all posts; visitors only see published ones
  const isAdminUser = !!user?.admin;
  const blogPosts = await prisma.blogPost.findMany({
    where: isAdminUser ? undefined : { published: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  // Reviews: visitors only see published ones
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Build a map for quick lookup
  const contentMap = new Map(allContents.map((c) => [c.heading, c]));

  // Ensure required headings are represented. If they don't exist in DB yet,
  // create placeholder objects so the page renders correctly.
  const now = new Date();
  const requiredPlaceholders = REQUIRED_HEADINGS
    .filter((h) => !contentMap.has(h))
    .map((h, i) => ({
      id: `__placeholder__${h}`,
      heading: h,
      subHeading: null,
      text: null,
      order: allContents.length + i,
      updatedAt: now,
    }));

  // Merge: DB rows first (already ordered), then any missing required sections appended
  const sections: Content[] = [
    ...allContents,
    ...(requiredPlaceholders as Content[]),
  ];

  const isAdmin = isAdminUser;

  const userProp = user
    ? { id: user.id ?? undefined, admin: user.admin ?? undefined }
    : null;

  return (
    <div className="w-full" style={{ backgroundColor: "var(--clr-bg)" }}>
      <PageClient
        sections={sections}
        openTimes={openTimes}
        galleryImages={galleryImages}
        blogPosts={blogPosts}
        reviews={reviews}
        user={userProp}
        isAdmin={isAdmin}
        loggedIn={!!session?.user}
        sessionUserId={session?.user?.id ?? undefined}
        sessionUserName={session?.user?.name ?? undefined}
      />

      <footer
        style={{
          backgroundColor: "#1A2E3B",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--clr-bg)",
            fontSize: "0.82rem",
            fontFamily: "'Lato', sans-serif",
            opacity: 0.75,
          }}
        >
          &copy; {(new Date()).getFullYear()} Freeston Tots
        </p>
      </footer>
    </div>
  );
}
