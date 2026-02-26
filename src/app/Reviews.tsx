"use client";

import React, { useState } from "react";
import { Review } from "@prisma/client";
import ReviewManagerModal from "@/components/ReviewManagerModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import SubmitReviewModal from "@/components/SubmitReviewModal";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface ReviewsProps {
    initialReviews: Review[];
    user?: { id?: string; admin?: boolean };
    loggedIn?: boolean;
    sessionUserId?: string;
    sessionUserName?: string;
}

function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i <= count ? "#F5C842" : "#e2e8f0"}
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

function formatReviewDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// Inline pencil SVG icon for the "Write a Review" button
function PencilIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

export default function Reviews({ initialReviews, user, loggedIn, sessionUserId, sessionUserName }: ReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [managerOpen, setManagerOpen] = useState(false);
    const [loginPromptOpen, setLoginPromptOpen] = useState(false);
    const [submitOpen, setSubmitOpen] = useState(false);
    const [thankYou, setThankYou] = useState(false);

    const publishedReviews = reviews.filter((r) => r.published);

    const handleWriteReviewClick = () => {
        if (!loggedIn) {
            setLoginPromptOpen(true);
        } else {
            setSubmitOpen(true);
        }
    };

    const handleSubmitSuccess = () => {
        setThankYou(true);
    };

    return (
        <div className="w-full flex flex-col items-center" style={{ gap: "1rem" }}>
            {/* Admin manage button */}
            {user?.admin && (
                <div className="flex justify-end w-full" style={{ maxWidth: 900 }}>
                    <button
                        onClick={() => setManagerOpen(true)}
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
                        <StarRoundedIcon style={{ fontSize: 16 }} />
                        Manage Reviews
                    </button>
                </div>
            )}

            {/* Reviews grid */}
            {publishedReviews.length === 0 ? (
                <div
                    style={{
                        maxWidth: 900,
                        width: "100%",
                        borderRadius: 20,
                        border: "2px solid var(--clr-border)",
                        padding: "3rem",
                        textAlign: "center",
                        color: "var(--clr-text-muted)",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.9rem",
                    }}
                >
                    No reviews yet — check back soon!
                </div>
            ) : (
                <div
                    style={{
                        maxWidth: 900,
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {publishedReviews.map((review) => (
                        <div
                            key={review.id}
                            style={{
                                backgroundColor: "var(--clr-surface)",
                                border: "1.5px solid var(--clr-border)",
                                borderRadius: 16,
                                padding: "1.25rem 1.35rem",
                                boxShadow: "0 2px 12px rgba(26,46,59,0.07)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.65rem",
                            }}
                        >
                            <Stars count={review.stars} />

                            <p
                                style={{
                                    margin: 0,
                                    fontStyle: "italic",
                                    fontFamily: "'Lato', sans-serif",
                                    fontSize: "0.9rem",
                                    color: "var(--clr-text)",
                                    lineHeight: 1.6,
                                    flex: 1,
                                }}
                            >
                                &ldquo;{review.content}&rdquo;
                            </p>

                            <div style={{ marginTop: "auto" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        fontFamily: "'Nunito', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.88rem",
                                        color: "var(--clr-text)",
                                    }}
                                >
                                    {review.reviewer}
                                </p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontFamily: "'Lato', sans-serif",
                                        fontSize: "0.78rem",
                                        color: "var(--clr-text-muted)",
                                        marginTop: "0.15rem",
                                    }}
                                >
                                    {formatReviewDate(review.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Write a Review button — shown to non-admin users */}
            {!user?.admin && (
                <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "0.5rem" }}>
                    {thankYou ? (
                        <div
                            role="status"
                            style={{
                                fontFamily: "'Lato', sans-serif",
                                fontSize: "0.88rem",
                                color: "var(--clr-text-muted)",
                                border: "1.5px solid var(--clr-border)",
                                borderRadius: 9999,
                                padding: "0.5rem 1.5rem",
                                backgroundColor: "var(--clr-surface)",
                                textAlign: "center",
                            }}
                        >
                            Thank you! Your review has been submitted and is awaiting approval.
                        </div>
                    ) : (
                        <button
                            onClick={handleWriteReviewClick}
                            style={{
                                background: "transparent",
                                border: "1.5px solid var(--clr-primary)",
                                borderRadius: 9999,
                                padding: "0.45rem 1.25rem",
                                cursor: "pointer",
                                fontSize: "0.88rem",
                                fontFamily: "'Lato', sans-serif",
                                fontWeight: 600,
                                color: "var(--clr-primary)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                transition: "all 0.2s",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(91,184,232,0.07)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                        >
                            <PencilIcon />
                            Write a Review
                        </button>
                    )}
                </div>
            )}

            {/* Admin: Review Manager Modal */}
            {user?.admin && (
                <ReviewManagerModal
                    open={managerOpen}
                    onClose={() => setManagerOpen(false)}
                    user={user}
                    onReviewsChange={(updated) => setReviews(updated)}
                />
            )}

            {/* Visitor: Login Prompt Modal */}
            <LoginPromptModal
                open={loginPromptOpen}
                onClose={() => setLoginPromptOpen(false)}
            />

            {/* Visitor: Submit Review Modal */}
            {loggedIn && sessionUserId && (
                <SubmitReviewModal
                    open={submitOpen}
                    onClose={() => setSubmitOpen(false)}
                    sessionUserId={sessionUserId}
                    reviewerName={(sessionUserName ?? "").split(" ")[0]}
                    onSuccess={handleSubmitSuccess}
                />
            )}
        </div>
    );
}
