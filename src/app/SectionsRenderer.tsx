"use client";

import React, { useState } from "react";
import Section from "@/components/Section";
import AddSectionModal from "@/components/AddSectionModal";
import Blog from "@/app/Blog";
import Gallery from "@/app/Gallery";
import OpenTimes from "@/app/OpenTimes";
import Reviews from "@/app/Reviews";
import ContactContent from "@/app/ContactContent";
import {
  Content,
  GalleryImage,
  OpenTimes as OpenTimesModel,
  BlogPost,
  BlogImage,
  Review,
} from "@prisma/client";

type BlogPostWithImages = BlogPost & { images: BlogImage[] };

// Sections that have special child components and cannot be deleted
const FIXED_SECTIONS = ["Open Times", "Blog", "Gallery", "Reviews", "Contact"];

const sectionBgAlternate = ["var(--clr-bg)", "var(--clr-surface-alt)"];

function WaveDivider({ fill }: Readonly<{ fill: string }>) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 0, width: "100%" }}>
      <svg
        viewBox="0 0 1200 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 60 }}
      >
        <path
          d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

interface SectionsRendererProps {
  sections: Content[];
  openTimes: OpenTimesModel[];
  galleryImages: GalleryImage[];
  blogPosts: BlogPostWithImages[];
  reviews: Review[];
  user: { id?: string; admin?: boolean } | null;
  isAdmin: boolean;
  loggedIn: boolean;
  sessionUserId?: string;
  sessionUserName?: string;
  onAddSection: () => void;
  addModalOpen: boolean;
  onAddModalClose: () => void;
}

export default function SectionsRenderer({
  sections: initialSections,
  openTimes,
  galleryImages,
  blogPosts,
  reviews,
  user,
  isAdmin,
  loggedIn,
  sessionUserId,
  sessionUserName,
  onAddSection,
  addModalOpen,
  onAddModalClose,
}: SectionsRendererProps) {
  const [sections, setSections] = useState<Content[]>(initialSections);

  const userProp = user ? { id: user.id, admin: user.admin } : undefined;

  const buildWithContent = (heading: string): React.JSX.Element | undefined => {
    if (heading === "Blog") {
      return <Blog initialPosts={blogPosts} user={userProp} />;
    }
    if (heading === "Gallery") {
      return <Gallery images={galleryImages} user={userProp} />;
    }
    if (heading === "Open Times") {
      return <OpenTimes times={openTimes} user={userProp} />;
    }
    if (heading === "Reviews") {
      return (
        <Reviews
          initialReviews={reviews}
          user={userProp}
          loggedIn={loggedIn}
          sessionUserId={sessionUserId}
          sessionUserName={sessionUserName}
        />
      );
    }
    if (heading === "Contact") {
      return <ContactContent />;
    }
    return undefined;
  };

  const persistOrder = async (orderedSections: Content[]) => {
    try {
      await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reorder",
          userId: user?.id,
          orderedHeadings: orderedSections.map((s) => s.heading),
        }),
      });
    } catch (err) {
      console.error("Failed to persist section order:", err);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...sections];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setSections(next);
    persistOrder(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setSections(next);
    persistOrder(next);
  };

  const handleDelete = async (heading: string) => {
    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          userId: user?.id,
          heading,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to delete section:", data.error);
        return;
      }
      setSections((prev) => prev.filter((s) => s.heading !== heading));
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  };

  const handleCreated = (newContent: Content) => {
    setSections((prev) => [...prev, newContent]);
  };

  return (
    <>
      {sections.map((sectionContent, index) => {
        const heading = sectionContent.heading;
        const SectionChild = buildWithContent(heading);
        const isFixed = FIXED_SECTIONS.includes(heading);
        const currentBg = sectionBgAlternate[index % 2];
        const nextBg = sections[index + 1]
          ? sectionBgAlternate[(index + 1) % 2]
          : null;

        return (
          <React.Fragment key={sectionContent.id}>
            <Section
              style={{ backgroundColor: currentBg }}
              heading={heading}
              content={sectionContent}
              user={userProp}
              updatable={heading !== "Gallery" && heading !== "Blog" && heading !== "Reviews"}
              deletable={!isFixed && isAdmin}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDelete={
                !isFixed && isAdmin ? () => handleDelete(heading) : undefined
              }
              isFirst={index === 0}
              isLast={index === sections.length - 1}
            >
              {SectionChild}
            </Section>
            {nextBg && <WaveDivider fill={nextBg} />}
          </React.Fragment>
        );
      })}

      <AddSectionModal
        open={addModalOpen}
        onClose={onAddModalClose}
        onCreated={handleCreated}
        user={userProp}
      />
    </>
  );
}
