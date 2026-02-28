"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BlogPost, BlogImage } from "@prisma/client";
import BlogManagerModal from "@/components/BlogManagerModal";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";

type BlogPostWithImages = BlogPost & { images: BlogImage[] };

interface BlogProps {
    initialPosts: BlogPostWithImages[];
    user?: { id?: string; admin?: boolean };
}

export default function Blog({ initialPosts, user }: BlogProps) {
    const admin = user?.admin;
    const [posts, setPosts] = useState<BlogPostWithImages[]>(initialPosts);
    const [modalOpen, setModalOpen] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const visiblePosts = user?.admin ? posts : posts.filter((p) => p.published);

    const toggleExpanded = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const formatDate = (date: Date | string) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="w-full flex flex-col items-center" style={{ gap: "1.25rem" }}>
            {/* Admin manage button */}
            {user?.admin && (
                <div className="flex justify-end w-full" style={{ maxWidth: 860 }}>
                    <button
                        onClick={() => setModalOpen(true)}
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
                        <EditCalendarOutlinedIcon style={{ fontSize: 16 }} />
                        Manage Blog
                    </button>
                </div>
            )}

            {/* Post grid */}
            {visiblePosts.length === 0 ? (
                <p
                    style={{
                        color: "var(--clr-text-muted)",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.95rem",
                        textAlign: "center",
                        padding: "2rem 0",
                    }}
                >
                    {
                        admin
                            ? "No blog posts yet. Click 'Manage Blog' to create your first post! (Currently hidden to visitors)"
                            : "No blog posts published yet. Check back soon!"
                    }
                </p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1.5rem",
                        width: "100%",
                        maxWidth: 860,
                    }}
                >
                    {visiblePosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            expanded={expandedIds.has(post.id)}
                            onToggleExpand={() => toggleExpanded(post.id)}
                            formatDate={formatDate}
                            showHiddenBadge={user?.admin && !post.published}
                        />
                    ))}
                </div>
            )}

            {user?.admin && (
                <BlogManagerModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    user={user}
                    initialPosts={posts}
                    onPostsChange={setPosts}
                />
            )}
        </div>
    );
}

interface BlogCardProps {
    post: BlogPostWithImages;
    expanded: boolean;
    onToggleExpand: () => void;
    formatDate: (d: Date | string) => string;
    showHiddenBadge?: boolean;
}

function BlogCard({ post, expanded, onToggleExpand, formatDate, showHiddenBadge }: BlogCardProps) {
    const EXCERPT_LENGTH = 120;
    const hasMore = post.content.length > EXCERPT_LENGTH;
    const excerpt = hasMore ? post.content.slice(0, EXCERPT_LENGTH).trimEnd() + "..." : post.content;
    const firstImage = post.images[0] ?? null;

    return (
        <article
            style={{
                backgroundColor: "var(--clr-surface)",
                border: "1px solid var(--clr-border)",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 16px rgba(26,46,59,0.07)",
                transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(91,184,232,0.18)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(26,46,59,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
        >
            {/* Image */}
            {firstImage && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16 / 9",
                        overflow: "hidden",
                        backgroundColor: "#e8f4fb",
                    }}
                >
                    <Image
                        src={firstImage.url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 600px) 100vw, 430px"
                    />
                </div>
            )}

            {/* Body */}
            <div style={{ padding: "1.1rem 1.25rem 1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {/* Title row + hidden badge */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <h3
                        style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: "var(--clr-text)",
                            lineHeight: 1.3,
                            margin: 0,
                            flex: 1,
                        }}
                    >
                        {post.title}
                    </h3>
                    {showHiddenBadge && (
                        <span
                            style={{
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                fontFamily: "'Lato', sans-serif",
                                color: "#64748b",
                                backgroundColor: "#f1f5f9",
                                borderRadius: 9999,
                                padding: "0.15rem 0.55rem",
                                flexShrink: 0,
                                marginTop: 2,
                            }}
                        >
                            Hidden
                        </span>
                    )}
                </div>

                {/* Date */}
                <p
                    style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.78rem",
                        color: "var(--clr-text-muted)",
                        margin: 0,
                    }}
                >
                    {formatDate(post.createdAt)}
                </p>

                {/* Content */}
                <p
                    style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: "0.88rem",
                        color: "var(--clr-text)",
                        lineHeight: 1.7,
                        margin: 0,
                        flex: 1,
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {expanded ? post.content : excerpt}
                </p>

                {/* Read more / less */}
                {hasMore && (
                    <button
                        onClick={onToggleExpand}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            fontFamily: "'Lato', sans-serif",
                            color: "var(--clr-primary)",
                            alignSelf: "flex-start",
                            textDecoration: "underline",
                            textUnderlineOffset: 2,
                        }}
                    >
                        {expanded ? "Show less" : "Read more"}
                    </button>
                )}
            </div>
        </article>
    );
}
