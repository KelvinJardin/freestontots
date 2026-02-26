"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
    Modal, Box, Typography, IconButton, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { GalleryImage } from "@prisma/client";

interface GalleryImageModalProps {
    open: boolean;
    onClose: () => void;
    user?: { id?: string; admin?: boolean };
    onImagesChange?: (images: GalleryImage[]) => void;
}

export default function GalleryImageModal({ open, onClose, user, onImagesChange }: GalleryImageModalProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/images");
            const data = await res.json();
            setImages(data);
            onImagesChange?.(data);
        } finally {
            setLoading(false);
        }
    }, [onImagesChange]);

    useEffect(() => {
        if (open) fetchImages();
    }, [open, fetchImages]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!acceptedFiles.length || !user?.id) return;
        setUploading(true);
        try {
            const formData = new FormData();
            for (const file of acceptedFiles) formData.append("file", file);
            formData.append("userId", user.id);

            const res = await fetch("/api/images/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            await fetchImages();
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    }, [user?.id, fetchImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    const toggleGallery = async (image: GalleryImage) => {
        setTogglingId(image.id);
        try {
            const res = await fetch(`/api/images/${image.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, inGallery: !image.inGallery }),
            });
            if (!res.ok) throw new Error("Toggle failed");
            const updated = await res.json();
            const next = images.map((img) => (img.id === updated.id ? updated : img));
            setImages(next);
            onImagesChange?.(next);
        } catch (err) {
            console.error(err);
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await fetch(`/api/images/${deleteTarget.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id }),
            });
            const next = images.filter((img) => img.id !== deleteTarget.id);
            setImages(next);
            onImagesChange?.(next);
            setDeleteTarget(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "95vw", sm: 680 },
                        maxHeight: "88vh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                                Manage Gallery Images
                            </Typography>
                            <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8" }} />
                    </Box>

                    {/* Scrollable body */}
                    <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* Drop zone */}
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: `2px dashed ${isDragActive ? "#5BB8E8" : "#e2e8f0"}`,
                                borderRadius: 2,
                                p: 3,
                                textAlign: "center",
                                cursor: "pointer",
                                bgcolor: isDragActive ? "rgba(91,184,232,0.05)" : "#fafafa",
                                transition: "all 0.2s",
                                "&:hover": { borderColor: "#5BB8E8", bgcolor: "rgba(91,184,232,0.04)" },
                            }}
                        >
                            <input {...getInputProps()} />
                            {uploading ? (
                                <CircularProgress size={28} sx={{ color: "#5BB8E8" }} />
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ color: "#5BB8E8", mb: 1, fontSize: 36 }} />
                                    <Typography fontSize="0.88rem" color="text.secondary">
                                        {isDragActive ? "Drop images here…" : "Drag & drop images, or click to select"}
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {/* Legend */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircleIcon sx={{ color: "#5BB8E8", fontSize: 18 }} />
                            <Typography fontSize="0.8rem" color="text.secondary">
                                = shown in gallery &nbsp;·&nbsp; click an image to toggle · click <DeleteIcon sx={{ fontSize: 14, verticalAlign: "middle" }} /> to delete
                            </Typography>
                        </Box>

                        {/* Image grid */}
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress sx={{ color: "#5BB8E8" }} />
                            </Box>
                        ) : images.length === 0 ? (
                            <Typography fontSize="0.9rem" color="text.secondary" textAlign="center" py={4}>
                                No images yet. Upload some above.
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                {images.map((img) => (
                                    <Box
                                        key={img.id}
                                        onClick={() => togglingId !== img.id && toggleGallery(img)}
                                        sx={{
                                            position: "relative",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            border: img.inGallery ? "2.5px solid #5BB8E8" : "2.5px solid transparent",
                                            boxShadow: img.inGallery ? "0 0 0 2px rgba(91,184,232,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                                            opacity: togglingId === img.id ? 0.6 : 1,
                                            transition: "all 0.2s",
                                            aspectRatio: "4/3",
                                            bgcolor: "#f8f8f8",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                            },
                                        }}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.filename}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                            sizes="180px"
                                        />

                                        {/* In-gallery badge */}
                                        {img.inGallery && (
                                            <Box sx={{ position: "absolute", top: 5, left: 5, pointerEvents: "none" }}>
                                                <CheckCircleIcon sx={{ color: "#5BB8E8", fontSize: 20, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />
                                            </Box>
                                        )}

                                        {/* Delete button */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(img); }}
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                bgcolor: "rgba(0,0,0,0.55)",
                                                color: "#fff",
                                                p: "3px",
                                                "&:hover": { bgcolor: "#dc2626" },
                                            }}
                                        >
                                            <DeleteIcon sx={{ fontSize: 15 }} />
                                        </IconButton>

                                        {/* Toggling spinner */}
                                        {togglingId === img.id && (
                                            <Box sx={{
                                                position: "absolute", inset: 0,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                bgcolor: "rgba(255,255,255,0.5)",
                                            }}>
                                                <CircularProgress size={24} sx={{ color: "#5BB8E8" }} />
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Modal>

            {/* Delete confirm dialog */}
            <Dialog open={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Image?</DialogTitle>
                <DialogContent>
                    <Typography fontSize="0.9rem" color="text.secondary">
                        This will permanently remove the image. This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                        disabled={deleting}
                        size="small"
                        variant="outlined"
                        sx={{ border: "1px solid #cbd5e1", color: "#475569", "&:hover": { border: "1px solid #94a3b8" } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        disabled={deleting}
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: "#dc2626", color: "#fff", "&:hover": { bgcolor: "#b91c1c" }, boxShadow: "none" }}
                    >
                        {deleting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
