"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Button,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Review } from "@prisma/client";

interface ReviewManagerModalProps {
    open: boolean;
    onClose: () => void;
    user?: { id?: string; admin?: boolean };
    onReviewsChange: (reviews: Review[]) => void;
}

type ViewMode = "list" | "form";

interface FormState {
    reviewer: string;
    content: string;
    stars: number;
}

const EMPTY_FORM: FormState = { reviewer: "", content: "", stars: 5 };

// Interactive star picker used in the form
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <Box sx={{ display: "flex", gap: 0.5, cursor: "pointer" }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(i)}
                    role="button"
                    aria-label={`${i} star${i !== 1 ? "s" : ""}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onChange(i); }}
                    style={{ outline: "none" }}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill={(hover || value) >= i ? "#F5C842" : "#e2e8f0"}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </span>
            ))}
        </Box>
    );
}

// Read-only small stars for list view
function SmallStars({ count }: { count: number }) {
    return (
        <Box sx={{ display: "flex", gap: "2px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <svg
                    key={i}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill={i <= count ? "#F5C842" : "#e2e8f0"}
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </Box>
    );
}

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// A single review row used in both pending and published sections
function ReviewRow({
    review,
    onEdit,
    onToggle,
    onDelete,
    onApprove,
    togglingId,
    confirmDeleteId,
    setConfirmDeleteId,
    deleting,
    approvingId,
}: {
    review: Review;
    onEdit: (r: Review) => void;
    onToggle: (r: Review) => void;
    onDelete: (id: string) => void;
    onApprove?: (r: Review) => void;
    togglingId: string | null;
    confirmDeleteId: string | null;
    setConfirmDeleteId: (id: string | null) => void;
    deleting: boolean;
    approvingId: string | null;
}) {
    const isPending = !review.approved;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1.75,
                borderRadius: 2,
                border: isPending ? "1px solid #f5e6a3" : "1px solid #e8f4fb",
                bgcolor: isPending ? "#fffdf0" : "#fafcff",
                transition: "box-shadow 0.2s",
                "&:hover": {
                    boxShadow: isPending
                        ? "0 2px 12px rgba(245,200,66,0.18)"
                        : "0 2px 12px rgba(91,184,232,0.12)",
                },
            }}
        >
            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                    <SmallStars count={review.stars} />
                </Box>
                <Typography
                    fontWeight={600}
                    fontSize="0.88rem"
                    fontFamily="'Nunito', sans-serif"
                    noWrap
                    title={review.reviewer}
                >
                    {review.reviewer}
                </Typography>
                <Typography
                    fontSize="0.76rem"
                    color="text.secondary"
                    noWrap
                    sx={{ fontStyle: "italic" }}
                    title={review.content}
                >
                    {review.content}
                </Typography>
                <Typography fontSize="0.72rem" color="text.secondary" mt={0.25}>
                    {formatDate(review.createdAt)}
                </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0, alignItems: "center" }}>
                {/* Approve button (pending only) */}
                {isPending && onApprove && (
                    <Button
                        size="small"
                        onClick={() => onApprove(review)}
                        disabled={approvingId === review.id}
                        variant="contained"
                        disableElevation
                        startIcon={
                            approvingId === review.id ? (
                                <CircularProgress size={12} sx={{ color: "#fff" }} />
                            ) : (
                                <CheckIcon sx={{ fontSize: 14 }} />
                            )
                        }
                        sx={{
                            minWidth: 0,
                            px: 1.25,
                            py: 0.3,
                            fontSize: "0.72rem",
                            bgcolor: "#22c55e",
                            color: "#fff",
                            borderRadius: 9999,
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#16a34a" },
                        }}
                    >
                        Approve
                    </Button>
                )}

                {/* Edit (published reviews) */}
                {!isPending && (
                    <IconButton
                        size="small"
                        onClick={() => onEdit(review)}
                        title="Edit review"
                        sx={{ color: "#5BB8E8", "&:hover": { bgcolor: "rgba(91,184,232,0.08)" } }}
                    >
                        <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}

                {/* Hide/Show toggle (approved reviews only) */}
                {!isPending && (
                    <IconButton
                        size="small"
                        onClick={() => onToggle(review)}
                        disabled={togglingId === review.id}
                        title={review.published ? "Hide review" : "Show review"}
                        sx={{ color: "#64748b", "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
                    >
                        {togglingId === review.id ? (
                            <CircularProgress size={14} sx={{ color: "#5BB8E8" }} />
                        ) : review.published ? (
                            <VisibilityOffIcon sx={{ fontSize: 16 }} />
                        ) : (
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                        )}
                    </IconButton>
                )}

                {/* Inline delete confirm */}
                {confirmDeleteId === review.id ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography fontSize="0.75rem" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            Sure?
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => onDelete(review.id)}
                            disabled={deleting}
                            sx={{
                                minWidth: 0,
                                px: 1,
                                py: 0.25,
                                fontSize: "0.72rem",
                                bgcolor: "#dc2626",
                                color: "#fff",
                                borderRadius: 9999,
                                "&:hover": { bgcolor: "#b91c1c" },
                            }}
                            variant="contained"
                            disableElevation
                        >
                            {deleting ? <CircularProgress size={11} sx={{ color: "#fff" }} /> : "Yes"}
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deleting}
                            sx={{
                                minWidth: 0,
                                px: 1,
                                py: 0.25,
                                fontSize: "0.72rem",
                                borderColor: "#cbd5e1",
                                color: "#475569",
                                borderRadius: 9999,
                            }}
                            variant="outlined"
                        >
                            No
                        </Button>
                    </Box>
                ) : (
                    <IconButton
                        size="small"
                        onClick={() => setConfirmDeleteId(review.id)}
                        title="Delete review"
                        sx={{ color: "#dc2626", "&:hover": { bgcolor: "rgba(220,38,38,0.06)" } }}
                    >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}

export default function ReviewManagerModal({
    open,
    onClose,
    user,
    onReviewsChange,
}: ReviewManagerModalProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<ViewMode>("list");
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/reviews");
            const data: Review[] = await res.json();
            setReviews(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchReviews();
        }
    }, [open, fetchReviews]);

    const syncReviews = (updated: Review[]) => {
        setReviews(updated);
        onReviewsChange(updated.filter((r) => r.published));
    };

    const openCreate = () => {
        setEditingReview(null);
        setForm(EMPTY_FORM);
        setView("form");
    };

    const openEdit = (review: Review) => {
        setEditingReview(review);
        setForm({ reviewer: review.reviewer, content: review.content, stars: review.stars });
        setView("form");
    };

    const goBack = () => {
        setView("list");
        setEditingReview(null);
        setForm(EMPTY_FORM);
    };

    const handleSave = async () => {
        if (!form.reviewer.trim() || !form.content.trim() || !user?.id) return;
        setSaving(true);
        try {
            const isEditing = !!editingReview;
            const url = isEditing ? "/api/reviews/update" : "/api/reviews/create";
            const body = isEditing
                ? {
                      userId: user.id,
                      reviewId: editingReview!.id,
                      reviewer: form.reviewer,
                      content: form.content,
                      stars: form.stars,
                  }
                : {
                      userId: user.id,
                      reviewer: form.reviewer,
                      content: form.content,
                      stars: form.stars,
                  };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Save failed");
            const saved: Review = await res.json();

            const next = isEditing
                ? reviews.map((r) => (r.id === saved.id ? saved : r))
                : [saved, ...reviews];

            syncReviews(next);
            goBack();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Approve a pending review (sets published: true)
    const handleApprove = async (review: Review) => {
        if (!user?.id) return;
        setApprovingId(review.id);
        try {
            const res = await fetch("/api/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, reviewId: review.id, approve: true }),
            });
            if (!res.ok) throw new Error("Approve failed");
            const updated: Review = await res.json();
            syncReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
        } catch (err) {
            console.error(err);
        } finally {
            setApprovingId(null);
        }
    };

    // Toggle published for published reviews
    const handleToggle = async (review: Review) => {
        if (!user?.id) return;
        setTogglingId(review.id);
        try {
            const res = await fetch("/api/reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, reviewId: review.id, published: !review.published }),
            });
            if (!res.ok) throw new Error("Toggle failed");
            const updated: Review = await res.json();
            syncReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
        } catch (err) {
            console.error(err);
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!user?.id) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, reviewId }),
            });
            if (!res.ok) throw new Error("Delete failed");
            syncReviews(reviews.filter((r) => r.id !== reviewId));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const isFormValid = form.reviewer.trim().length > 0 && form.content.trim().length > 0 && form.stars >= 1;

    // pending = never approved; hidden = approved but not visible; published = approved + visible
    const pendingReviews = reviews.filter((r) => !r.approved);
    const publishedReviews = reviews.filter((r) => r.approved && r.published);
    const hiddenReviews = reviews.filter((r) => r.approved && !r.published);

    const rowProps = {
        togglingId,
        confirmDeleteId,
        setConfirmDeleteId,
        deleting,
        approvingId,
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "92vw", sm: 540 },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    p: { xs: 3, sm: 4 },
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {view === "form" && (
                            <IconButton size="small" onClick={goBack} sx={{ color: "#5BB8E8", mr: 0.5 }}>
                                <ArrowBackIcon fontSize="small" />
                            </IconButton>
                        )}
                        <Typography variant="h6" fontWeight={700} fontSize="1.05rem" fontFamily="'Nunito', sans-serif">
                            {view === "list"
                                ? "Manage Reviews"
                                : editingReview
                                ? "Edit Review"
                                : "Add Review"}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Accent bar */}
                <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

                {/* Body */}
                {view === "list" ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                                <CircularProgress sx={{ color: "#5BB8E8" }} />
                            </Box>
                        ) : (
                            <>
                                {/* Pending Approval Section */}
                                {pendingReviews.length > 0 && (
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mb: 1,
                                                px: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    bgcolor: "#F5C842",
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Typography
                                                fontSize="0.78rem"
                                                fontWeight={700}
                                                fontFamily="'Nunito', sans-serif"
                                                sx={{ color: "#b45309", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                            >
                                                Pending Approval
                                            </Typography>
                                            <Box
                                                sx={{
                                                    ml: 0.5,
                                                    px: 0.9,
                                                    py: 0.1,
                                                    bgcolor: "#F5C842",
                                                    borderRadius: 9999,
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    color: "#7a5c00",
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {pendingReviews.length}
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            {pendingReviews.map((review) => (
                                                <ReviewRow
                                                    key={review.id}
                                                    review={review}
                                                    onEdit={openEdit}
                                                    onToggle={handleToggle}
                                                    onDelete={handleDelete}
                                                    onApprove={handleApprove}
                                                    {...rowProps}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Published Section */}
                                <Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 1,
                                            px: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                bgcolor: "#5BB8E8",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography
                                            fontSize="0.78rem"
                                            fontWeight={700}
                                            fontFamily="'Nunito', sans-serif"
                                            sx={{ color: "#1e6b9c", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                        >
                                            Published
                                        </Typography>
                                        <Box
                                            sx={{
                                                ml: 0.5,
                                                px: 0.9,
                                                py: 0.1,
                                                bgcolor: "rgba(91,184,232,0.18)",
                                                borderRadius: 9999,
                                                fontSize: "0.7rem",
                                                fontWeight: 700,
                                                color: "#1e6b9c",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {publishedReviews.length}
                                        </Box>
                                    </Box>
                                    {publishedReviews.length === 0 ? (
                                        <Typography
                                            fontSize="0.85rem"
                                            color="text.secondary"
                                            textAlign="center"
                                            py={2}
                                            fontFamily="'Lato', sans-serif"
                                        >
                                            No published reviews yet.
                                        </Typography>
                                    ) : (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            {publishedReviews.map((review) => (
                                                <ReviewRow
                                                    key={review.id}
                                                    review={review}
                                                    onEdit={openEdit}
                                                    onToggle={handleToggle}
                                                    onDelete={handleDelete}
                                                    {...rowProps}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                {/* Hidden Section */}
                                {hiddenReviews.length > 0 && (
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, px: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#94a3b8", flexShrink: 0 }} />
                                            <Typography fontSize="0.78rem" fontWeight={700} fontFamily="'Nunito', sans-serif" sx={{ color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                                Hidden
                                            </Typography>
                                            <Box sx={{ ml: 0.5, px: 0.9, py: 0.1, bgcolor: "rgba(148,163,184,0.2)", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700, color: "#475569", lineHeight: 1.6 }}>
                                                {hiddenReviews.length}
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            {hiddenReviews.map((review) => (
                                                <ReviewRow
                                                    key={review.id}
                                                    review={review}
                                                    onEdit={openEdit}
                                                    onToggle={handleToggle}
                                                    onDelete={handleDelete}
                                                    {...rowProps}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {reviews.length === 0 && (
                                    <Typography fontSize="0.9rem" color="text.secondary" textAlign="center" py={4}>
                                        No reviews yet. Add the first one!
                                    </Typography>
                                )}

                                {/* Add button */}
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={openCreate}
                                    fullWidth
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        mt: 0.5,
                                        bgcolor: "#5BB8E8",
                                        color: "#fff",
                                        fontFamily: "'Lato', sans-serif",
                                        fontWeight: 700,
                                        borderRadius: 9999,
                                        "&:hover": { bgcolor: "#3DA3D9" },
                                    }}
                                >
                                    Add Review
                                </Button>
                            </>
                        )}
                    </Box>
                ) : (
                    /* Form view */
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField
                            label="Reviewer name"
                            value={form.reviewer}
                            onChange={(e) => setForm((prev) => ({ ...prev, reviewer: e.target.value }))}
                            fullWidth
                            required
                            size="small"
                            inputProps={{ maxLength: 120 }}
                        />

                        <Box>
                            <Typography
                                fontSize="0.82rem"
                                color="text.secondary"
                                mb={1}
                                fontFamily="'Lato', sans-serif"
                            >
                                Star rating
                            </Typography>
                            <StarPicker
                                value={form.stars}
                                onChange={(v) => setForm((prev) => ({ ...prev, stars: v }))}
                            />
                        </Box>

                        <TextField
                            label="Review content"
                            value={form.content}
                            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                            fullWidth
                            required
                            multiline
                            rows={4}
                            size="small"
                        />

                        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 0.5 }}>
                            <Button
                                variant="outlined"
                                onClick={goBack}
                                size="small"
                                sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: 9999 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                size="small"
                                disabled={saving || !isFormValid}
                                disableElevation
                                sx={{
                                    bgcolor: "#5BB8E8",
                                    color: "#fff",
                                    borderRadius: 9999,
                                    "&:hover": { bgcolor: "#3DA3D9" },
                                    "&.Mui-disabled": { bgcolor: "#c8e8f8", color: "#fff" },
                                }}
                            >
                                {saving ? (
                                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                                ) : editingReview ? (
                                    "Save Changes"
                                ) : (
                                    "Add Review"
                                )}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}
