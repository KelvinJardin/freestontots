"use client";

import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import { GalleryImage } from "@prisma/client";
import GalleryImageModal from "@/components/GalleryImageModal";

interface GalleryProps {
    images: GalleryImage[];
    user?: { id?: string; admin?: boolean };
}

export default function Gallery({ images: initialImages, user }: GalleryProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [images, setImages] = useState<GalleryImage[]>(initialImages);

    const galleryImages = images.filter((img) => img.inGallery);

    return (
        <div className="w-full flex flex-col items-center" style={{ gap: "0.75rem" }}>
            {/* Manage button for admins */}
            {user?.admin && (
                <div className="flex justify-end w-full" style={{ maxWidth: 760 }}>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center gap-1.5"
                        style={{
                            background: "none",
                            border: "1.5px solid var(--clr-border)",
                            borderRadius: 9999,
                            padding: "0.3rem 0.85rem",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: 600,
                            color: "var(--clr-text-muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "var(--clr-primary)";
                            e.currentTarget.style.color = "var(--clr-primary)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "var(--clr-border)";
                            e.currentTarget.style.color = "var(--clr-text-muted)";
                        }}
                    >
                        <PhotoLibraryOutlinedIcon style={{ fontSize: 16 }} />
                        Manage Images
                    </button>
                </div>
            )}

            {/* Carousel */}
            <div className="w-full" style={{ maxWidth: 760, marginTop: "0.25rem" }}>
                {galleryImages.length === 0 ? (
                    <div
                        style={{
                            borderRadius: 20,
                            border: "2px solid var(--clr-border)",
                            padding: "3rem",
                            textAlign: "center",
                            color: "var(--clr-text-muted)",
                            fontFamily: "'Lato', sans-serif",
                            fontSize: "0.9rem",
                        }}
                    >
                        No images in the gallery yet.
                    </div>
                ) : (
                    <div
                        style={{
                            borderRadius: 20,
                            overflow: "hidden",
                            boxShadow: "0 8px 40px rgba(26,46,59,0.15)",
                            border: "2px solid var(--clr-border)",
                        }}
                    >
                        <Carousel
                            animation="slide"
                            navButtonsAlwaysVisible
                            indicators
                            navButtonsProps={{
                                style: {
                                    backgroundColor: "rgba(0,0,0,0.35)",
                                    borderRadius: "50%",
                                },
                            }}
                            indicatorContainerProps={{
                                style: { marginTop: 12 },
                            }}
                        >
                            {galleryImages.map((img, i) => (
                                <div key={img.id} style={{ width: "100%", lineHeight: 0 }}>
                                    <Image
                                        src={img.url}
                                        alt={`Gallery image ${i + 1}`}
                                        width={760}
                                        height={470}
                                        className="object-cover"
                                        style={{ width: "100%", height: "auto", display: "block" }}
                                        sizes="(max-width: 600px) 100vw, 760px"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
            </div>

            {user?.admin && (
                <GalleryImageModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    user={user}
                    onImagesChange={setImages}
                />
            )}
        </div>
    );
}
