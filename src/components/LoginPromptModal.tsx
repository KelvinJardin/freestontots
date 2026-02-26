"use client";

import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { signIn } from "next-auth/react";

interface LoginPromptModalProps {
    open: boolean;
    onClose: () => void;
}

export default function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: window.location.href + "#Reviews" });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "92vw", sm: 440 },
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
                        Sign in to leave a review
                    </Typography>
                    <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Accent bar */}
                <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

                {/* Message */}
                <Typography
                    fontSize="0.9rem"
                    fontFamily="'Lato', sans-serif"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.65 }}
                >
                    We&apos;d love to hear from you! Sign in with your Google account to submit a review.
                </Typography>

                {/* Google Sign-In Button */}
                <Button
                    onClick={handleGoogleSignIn}
                    fullWidth
                    variant="outlined"
                    sx={{
                        mb: 1.5,
                        borderColor: "#dadce0",
                        color: "#3c4043",
                        bgcolor: "#fff",
                        borderRadius: 9999,
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textTransform: "none",
                        py: 1.1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        "&:hover": {
                            bgcolor: "#f8f9fa",
                            borderColor: "#c6c9cd",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        },
                    }}
                    startIcon={
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                    }
                >
                    Continue with Google
                </Button>

                {/* Cancel */}
                <Button
                    onClick={onClose}
                    fullWidth
                    variant="text"
                    sx={{
                        color: "#64748b",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.85rem",
                        textTransform: "none",
                        borderRadius: 9999,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
}
