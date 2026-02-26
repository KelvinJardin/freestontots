"use client";

import React, { useState, useCallback } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { BlogPost, BlogImage } from "@prisma/client";

type BlogPostWithImages = BlogPost & { images: BlogImage[] };

interface BlogManagerModalProps {
    open: boolean;
    onClose: () => void;
    user?: { id?: string; admin?: boolean };
    initialPosts: BlogPostWithImages[];
    onPostsChange: (posts: BlogPostWithImages[]) => void;
}

type ViewMode = "list" | "form";

interface FormState {
    title: string;
    content: string;
    pendingFiles: File[];
}

const EMPTY_FORM: FormState = { title: "", content: "", pendingFiles: [] };

export default function BlogManagerModal({
    open,
    onClose,
    user,
    initialPosts,
    onPostsChange,
}: BlogManagerModalProps) {
    const [posts, setPosts] = useState<BlogPostWithImages[]>(initialPosts);
    const [view, setView] = useState<ViewMode>("list");
    const [editingPost, setEditingPost] = useState<BlogPostWithImages | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<BlogPostWithImages | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

    // Keep local posts in sync when the modal opens with fresh data
    React.useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const syncPosts = (updated: BlogPostWithImages[]) => {
        setPosts(updated);
        onPostsChange(updated);
    };

    // --- Dropzone ---
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setForm((prev) => ({ ...prev, pendingFiles: [...prev.pendingFiles, ...acceptedFiles] }));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    const removePendingFile = (index: number) => {
        setForm((prev) => ({
            ...prev,
            pendingFiles: prev.pendingFiles.filter((_, i) => i !== index),
        }));
    };

    // --- Navigation ---
    const openCreate = () => {
        setEditingPost(null);
        setForm(EMPTY_FORM);
        setView("form");
    };

    const openEdit = (post: BlogPostWithImages) => {
        setEditingPost(post);
        setForm({ title: post.title, content: post.content, pendingFiles: [] });
        setView("form");
    };

    const goBack = () => {
        setView("list");
        setEditingPost(null);
        setForm(EMPTY_FORM);
    };

    // --- Save (create or update) ---
    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim() || !user?.id) return;
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("title", form.title);
            formData.append("content", form.content);
            for (const file of form.pendingFiles) {
                formData.append("images", file);
            }

            let url = "/api/blog/create";
            if (editingPost) {
                formData.append("postId", editingPost.id);
                url = "/api/blog/update";
            }

            const res = await fetch(url, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Save failed");
            const saved: BlogPostWithImages = await res.json();

            const next = editingPost
                ? posts.map((p) => (p.id === saved.id ? saved : p))
                : [saved, ...posts];

            syncPosts(next);
            goBack();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // --- Toggle published ---
    const handleTogglePublished = async (post: BlogPostWithImages) => {
        if (!user?.id) return;
        setTogglingId(post.id);
        try {
            const res = await fetch("/api/blog", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, postId: post.id, published: !post.published }),
            });
            if (!res.ok) throw new Error("Toggle failed");
            const updated: BlogPostWithImages = await res.json();
            syncPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
        } catch (err) {
            console.error(err);
        } finally {
            setTogglingId(null);
        }
    };

    // --- Delete post ---
    const confirmDeletePost = async () => {
        if (!deleteTarget || !user?.id) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/blog", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, postId: deleteTarget.id }),
            });
            if (!res.ok) throw new Error("Delete failed");
            syncPosts(posts.filter((p) => p.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    // --- Delete single image from existing post ---
    const handleDeleteImage = async (image: BlogImage) => {
        if (!user?.id) return;
        setDeletingImageId(image.id);
        try {
            const res = await fetch("/api/blog/images", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, imageId: image.id }),
            });
            if (!res.ok) throw new Error("Image delete failed");
            // Update the editing post images locally
            if (editingPost) {
                const updatedPost = {
                    ...editingPost,
                    images: editingPost.images.filter((img) => img.id !== image.id),
                };
                setEditingPost(updatedPost);
                syncPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingImageId(null);
        }
    };

    const formatDate = (date: Date | string) =>
        new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "95vw", sm: 700 },
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 3,
                            pt: 3,
                            pb: 2,
                            borderBottom: "1px solid #f1f5f9",
                            flexShrink: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {view === "form" && (
                                    <IconButton size="small" onClick={goBack} sx={{ color: "#5BB8E8", mr: 0.5 }}>
                                        <ArrowBackIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
                                    {view === "list"
                                        ? "Manage Blog"
                                        : editingPost
                                        ? "Edit Post"
                                        : "Create Post"}
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8" }} />
                    </Box>

                    {/* Scrollable body */}
                    <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
                        {view === "list" ? (
                            <ListPanel
                                posts={posts}
                                togglingId={togglingId}
                                onEdit={openEdit}
                                onToggle={handleTogglePublished}
                                onDelete={setDeleteTarget}
                                onCreate={openCreate}
                                formatDate={formatDate}
                            />
                        ) : (
                            <FormPanel
                                form={form}
                                setForm={setForm}
                                editingPost={editingPost}
                                saving={saving}
                                onSave={handleSave}
                                onCancel={goBack}
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                onRemovePendingFile={removePendingFile}
                                onDeleteImage={handleDeleteImage}
                                deletingImageId={deletingImageId}
                            />
                        )}
                    </Box>
                </Box>
            </Modal>

            {/* Delete confirm dialog */}
            <Dialog
                open={!!deleteTarget}
                onClose={() => !deleting && setDeleteTarget(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Delete Post?</DialogTitle>
                <DialogContent>
                    <Typography fontSize="0.9rem" color="text.secondary">
                        &quot;{deleteTarget?.title}&quot; will be permanently deleted along with all its images.
                        This cannot be undone.
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
                        onClick={confirmDeletePost}
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

// ---- Sub-components ----

interface ListPanelProps {
    posts: BlogPostWithImages[];
    togglingId: string | null;
    onEdit: (post: BlogPostWithImages) => void;
    onToggle: (post: BlogPostWithImages) => void;
    onDelete: (post: BlogPostWithImages) => void;
    onCreate: () => void;
    formatDate: (d: Date | string) => string;
}

function ListPanel({ posts, togglingId, onEdit, onToggle, onDelete, onCreate, formatDate }: ListPanelProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {posts.length === 0 ? (
                <Typography fontSize="0.9rem" color="text.secondary" textAlign="center" py={4}>
                    No posts yet. Create your first one!
                </Typography>
            ) : (
                posts.map((post) => (
                    <Box
                        key={post.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #e8f4fb",
                            bgcolor: "#fafcff",
                            transition: "box-shadow 0.2s",
                            "&:hover": { boxShadow: "0 2px 12px rgba(91,184,232,0.12)" },
                        }}
                    >
                        {/* Thumbnail */}
                        {post.images[0] ? (
                            <Box
                                sx={{
                                    width: 56,
                                    height: 40,
                                    borderRadius: 1.5,
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    position: "relative",
                                    bgcolor: "#eee",
                                }}
                            >
                                <Image
                                    src={post.images[0].url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: 56,
                                    height: 40,
                                    borderRadius: 1.5,
                                    bgcolor: "#e8f4fb",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 18, color: "#5BB8E8", opacity: 0.6 }} />
                            </Box>
                        )}

                        {/* Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                fontWeight={600}
                                fontSize="0.92rem"
                                fontFamily="'Nunito', sans-serif"
                                noWrap
                                title={post.title}
                            >
                                {post.title}
                            </Typography>
                            <Typography fontSize="0.76rem" color="text.secondary">
                                {formatDate(post.createdAt)}
                            </Typography>
                        </Box>

                        {/* Published badge */}
                        <Chip
                            label={post.published ? "Published" : "Hidden"}
                            size="small"
                            sx={{
                                bgcolor: post.published ? "rgba(91,184,232,0.12)" : "#f1f5f9",
                                color: post.published ? "#5BB8E8" : "#64748b",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                height: 22,
                                flexShrink: 0,
                            }}
                        />

                        {/* Actions */}
                        <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                            <IconButton
                                size="small"
                                onClick={() => onEdit(post)}
                                title="Edit post"
                                sx={{ color: "#5BB8E8", "&:hover": { bgcolor: "rgba(91,184,232,0.08)" } }}
                            >
                                <EditIcon sx={{ fontSize: 17 }} />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => onToggle(post)}
                                disabled={togglingId === post.id}
                                title={post.published ? "Hide post" : "Publish post"}
                                sx={{ color: "#64748b", "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
                            >
                                {togglingId === post.id ? (
                                    <CircularProgress size={16} sx={{ color: "#5BB8E8" }} />
                                ) : post.published ? (
                                    <VisibilityOffIcon sx={{ fontSize: 17 }} />
                                ) : (
                                    <VisibilityIcon sx={{ fontSize: 17 }} />
                                )}
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={() => onDelete(post)}
                                title="Delete post"
                                sx={{ color: "#dc2626", "&:hover": { bgcolor: "rgba(220,38,38,0.06)" } }}
                            >
                                <DeleteIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Box>
                    </Box>
                ))
            )}

            {/* Create button */}
            <Button
                startIcon={<AddIcon />}
                onClick={onCreate}
                fullWidth
                variant="contained"
                sx={{
                    mt: 1,
                    bgcolor: "#5BB8E8",
                    color: "#fff",
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    borderRadius: 9999,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#3DA3D9", boxShadow: "none" },
                }}
            >
                Create Post
            </Button>
        </Box>
    );
}

interface FormPanelProps {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    editingPost: BlogPostWithImages | null;
    saving: boolean;
    onSave: () => void;
    onCancel: () => void;
    getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
    getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
    isDragActive: boolean;
    onRemovePendingFile: (index: number) => void;
    onDeleteImage: (image: BlogImage) => void;
    deletingImageId: string | null;
}

function FormPanel({
    form,
    setForm,
    editingPost,
    saving,
    onSave,
    onCancel,
    getRootProps,
    getInputProps,
    isDragActive,
    onRemovePendingFile,
    onDeleteImage,
    deletingImageId,
}: FormPanelProps) {
    const isValid = form.title.trim().length > 0 && form.content.trim().length > 0;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
                label="Title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                fullWidth
                required
                size="small"
                inputProps={{ maxLength: 200 }}
            />

            <TextField
                label="Content"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                fullWidth
                required
                multiline
                rows={6}
                size="small"
            />

            {/* Existing images (edit mode) */}
            {editingPost && editingPost.images.length > 0 && (
                <Box>
                    <Typography fontSize="0.82rem" color="text.secondary" mb={1}>
                        Existing images
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                        {editingPost.images.map((img) => (
                            <Box
                                key={img.id}
                                sx={{
                                    position: "relative",
                                    width: 90,
                                    height: 70,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    border: "1.5px solid #e8f4fb",
                                    opacity: deletingImageId === img.id ? 0.5 : 1,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.filename}
                                    fill
                                    className="object-cover"
                                    sizes="90px"
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => onDeleteImage(img)}
                                    disabled={deletingImageId === img.id}
                                    sx={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        bgcolor: "rgba(0,0,0,0.55)",
                                        color: "#fff",
                                        p: "2px",
                                        "&:hover": { bgcolor: "#dc2626" },
                                    }}
                                >
                                    {deletingImageId === img.id ? (
                                        <CircularProgress size={12} sx={{ color: "#fff" }} />
                                    ) : (
                                        <DeleteIcon sx={{ fontSize: 13 }} />
                                    )}
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Dropzone */}
            <Box>
                <Typography fontSize="0.82rem" color="text.secondary" mb={1}>
                    {editingPost ? "Add more images" : "Images (optional)"}
                </Typography>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: `2px dashed ${isDragActive ? "#5BB8E8" : "#e2e8f0"}`,
                        borderRadius: 2,
                        p: 2.5,
                        textAlign: "center",
                        cursor: "pointer",
                        bgcolor: isDragActive ? "rgba(91,184,232,0.05)" : "#fafafa",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: "#5BB8E8", bgcolor: "rgba(91,184,232,0.04)" },
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ color: "#5BB8E8", mb: 0.5, fontSize: 30 }} />
                    <Typography fontSize="0.85rem" color="text.secondary">
                        {isDragActive ? "Drop images here..." : "Drag & drop images, or click to select"}
                    </Typography>
                </Box>

                {/* Pending files preview */}
                {form.pendingFiles.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                        {form.pendingFiles.map((file, i) => (
                            <Chip
                                key={`${file.name}-${i}`}
                                label={file.name}
                                size="small"
                                onDelete={() => onRemovePendingFile(i)}
                                sx={{ fontSize: "0.75rem", maxWidth: 180 }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    size="small"
                    sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: 9999 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={onSave}
                    size="small"
                    disabled={saving || !isValid}
                    sx={{
                        bgcolor: "#5BB8E8",
                        color: "#fff",
                        borderRadius: 9999,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#3DA3D9", boxShadow: "none" },
                        "&.Mui-disabled": { bgcolor: "#c8e8f8", color: "#fff" },
                    }}
                >
                    {saving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : editingPost ? "Save Changes" : "Publish Post"}
                </Button>
            </Box>
        </Box>
    );
}
