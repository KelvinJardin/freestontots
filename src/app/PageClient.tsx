"use client";

import React, { useState } from "react";
import Home from "@/app/Home";
import SectionsRenderer from "@/app/SectionsRenderer";
import { Content, GalleryImage, OpenTimes as OpenTimesModel, BlogPost, BlogImage, Review } from "@prisma/client";

type BlogPostWithImages = BlogPost & { images: BlogImage[] };

interface PageClientProps {
  sections: Content[];
  openTimes: OpenTimesModel[];
  galleryImages: GalleryImage[];
  blogPosts: BlogPostWithImages[];
  reviews: Review[];
  user: { id?: string; admin?: boolean } | null;
  isAdmin: boolean;
  loggedIn: boolean;
  sessionUserId?: string;
}

export default function PageClient({
  sections,
  openTimes,
  galleryImages,
  blogPosts,
  reviews,
  user,
  isAdmin,
  loggedIn,
  sessionUserId,
}: PageClientProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <>
      <Home
        isAdmin={isAdmin}
        onAddSection={() => setAddModalOpen(true)}
      />
      <SectionsRenderer
        sections={sections}
        openTimes={openTimes}
        galleryImages={galleryImages}
        blogPosts={blogPosts}
        reviews={reviews}
        user={user}
        isAdmin={isAdmin}
        loggedIn={loggedIn}
        sessionUserId={sessionUserId}
        onAddSection={() => setAddModalOpen(true)}
        addModalOpen={addModalOpen}
        onAddModalClose={() => setAddModalOpen(false)}
      />
    </>
  );
}
