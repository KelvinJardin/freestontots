"use client";

import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SubmitReviewModalProps {
    open: boolean;
    onClose: () => void;
    sessionUserId: string;
    onSuccess: () => void;
}

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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onChange(i);
                    }}
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

export default function SubmitReviewModal({
    open,
    onClose,
    sessionUserId,
    onSuccess,
}: SubmitReviewModalProps) {
    const [reviewer, setReviewer] = useState("");
    const [stars, setStars] = useState(5);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = reviewer.trim().length > 0 && content.trim().length > 0 && stars >= 1;

    const handleClose = () => {
        setReviewer("");
        setStars(5);
        setContent("");
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!isValid) return;
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionUserId, reviewer: reviewer.trim(), content: content.trim(), stars }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Something went wrong. Please try again.");
                return;
            }
            handleClose();
            onSuccess();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "92vw", sm: 480 },
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
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        fontSize="1.05rem"
                        fontFamily="'Nunito', sans-serif"
                    >
                        Write a Review
                    </Typography>
                    <IconButton size="small" onClick={handleClose} sx={{ color: "#94a3b8" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Accent bar */}
                <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

                {/* Form */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                        label="Your name"
                        value={reviewer}
                        onChange={(e) => setReviewer(e.target.value)}
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
                        <StarPicker value={stars} onChange={setStars} />
                    </Box>

                    <TextField
                        label="Your review"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        size="small"
                    />

                    {error && (
                        <Typography
                            fontSize="0.82rem"
                            color="error"
                            fontFamily="'Lato', sans-serif"
                            role="alert"
                        >
                            {error}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", pt: 0.5 }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            size="small"
                            disabled={submitting}
                            sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: 9999 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            size="small"
                            disabled={submitting || !isValid}
                            disableElevation
                            sx={{
                                bgcolor: "#5BB8E8",
                                color: "#fff",
                                borderRadius: 9999,
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 700,
                                "&:hover": { bgcolor: "#3DA3D9" },
                                "&.Mui-disabled": { bgcolor: "#c8e8f8", color: "#fff" },
                            }}
                        >
                            {submitting ? (
                                <CircularProgress size={16} sx={{ color: "#fff" }} />
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
