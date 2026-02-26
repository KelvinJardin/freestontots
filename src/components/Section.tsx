"use client";

import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditContentModal from "@/components/EditContentModal";
import { Content } from "@prisma/client";

interface SectionProps {
  style?: React.CSSProperties;
  heading: string;
  content: Content;
  children?: React.ReactNode;
  user?: { id?: string; admin?: boolean };
  updatable: boolean;
  deletable?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// Regex that splits a line into text segments and ![alt](url) image tokens
const IMAGE_TOKEN_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;

interface LineSegment {
  type: "text" | "image";
  value: string;   // text content or image URL
  alt?: string;
}

function parseLineSegments(line: string): LineSegment[] {
  const segments: LineSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  IMAGE_TOKEN_RE.lastIndex = 0;

  while ((match = IMAGE_TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: line.slice(lastIndex, match.index) });
    }
    segments.push({ type: "image", value: match[2], alt: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    segments.push({ type: "text", value: line.slice(lastIndex) });
  }

  return segments;
}

function isImageOnlyLine(segments: LineSegment[]): boolean {
  return segments.length > 0 && segments.every((s) => s.type === "image");
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
        backdropFilter: "blur(4px)",
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 20,
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

const imageHoverStyle: React.CSSProperties = {
  cursor: "zoom-in",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

function ZoomImg({ src, alt, style }: { src: string; alt: string; style: React.CSSProperties }) {
  const [lightbox, setLightbox] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{
          ...style,
          ...imageHoverStyle,
          transform: hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.18)" : (style.boxShadow as string | undefined),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setLightbox(true)}
      />
      {lightbox && <ImageLightbox src={src} alt={alt} onClose={() => setLightbox(false)} />}
    </>
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");

  // Check if the entire text is image-only lines (e.g. Accreditations section)
  const allLinesAreImageOnly = lines.every((line) => {
    if (line.trim() === "") return true;
    const segs = parseLineSegments(line);
    return isImageOnlyLine(segs);
  });

  if (allLinesAreImageOnly) {
    // Collect all images across all lines and render in a single flex-wrap row
    const allImages: LineSegment[] = [];
    for (const line of lines) {
      if (line.trim() === "") continue;
      parseLineSegments(line).forEach((s) => {
        if (s.type === "image") allImages.push(s);
      });
    }
    return (
      <div
        className="animate-in-delay-2"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          maxWidth: 680,
        }}
      >
        {allImages.map((img, i) => (
          <ZoomImg
            key={i}
            src={img.value}
            alt={img.alt || ""}
            style={{ maxWidth: 120, height: "auto", borderRadius: 8, margin: 4, objectFit: "contain" }}
          />
        ))}
      </div>
    );
  }

  // Mixed or plain text: render line by line, images inline
  return (
    <p
      className="text-center animate-in-delay-2"
      style={{
        color: "var(--clr-text)",
        fontSize: "0.95rem",
        lineHeight: 1.75,
        maxWidth: 680,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {lines.map((line, lineIndex) => {
        const segments = parseLineSegments(line);

        if (isImageOnlyLine(segments)) {
          // Image-only line inside otherwise mixed content — render as a centred flex row
          return (
            <React.Fragment key={lineIndex}>
              <span
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                  margin: "4px 0",
                }}
              >
                {segments.map((seg, i) => (
                  <ZoomImg
                    key={i}
                    src={seg.value}
                    alt={seg.alt || ""}
                    style={{ maxWidth: 120, height: "auto", borderRadius: 8, margin: 2, objectFit: "contain" }}
                  />
                ))}
              </span>
              <br />
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={lineIndex}>
            {segments.map((seg, i) =>
              seg.type === "image" ? (
                <ZoomImg
                  key={i}
                  src={seg.value}
                  alt={seg.alt || ""}
                  style={{ height: "1.5em", width: "auto", borderRadius: 4, margin: "0 3px", verticalAlign: "middle", objectFit: "contain" }}
                />
              ) : (
                <React.Fragment key={i}>{seg.value}</React.Fragment>
              )
            )}
            <br />
          </React.Fragment>
        );
      })}
    </p>
  );
}

export default function Section({
  style,
  heading,
  content: sectionContent,
  children,
  user,
  updatable,
  deletable,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: SectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState<Content | null | undefined>(sectionContent);

  const displayHeading = content?.heading || heading;
  const isAdmin = !!user?.admin;

  return (
    <div
      className="flex flex-col items-center"
      style={{ ...style, paddingTop: "4rem", paddingBottom: "4rem", position: "relative" }}
      id={(content?.heading || heading).replace(/\s+/g, "-")}
    >
      {/* Admin reorder arrows — top-right corner */}
      {isAdmin && (onMoveUp || onMoveDown) && (
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            zIndex: 10,
          }}
        >
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label={`Move ${displayHeading} section up`}
            style={{
              background: "none",
              border: "1px solid var(--clr-border)",
              borderRadius: "6px",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isFirst ? "not-allowed" : "pointer",
              opacity: isFirst ? 0.35 : 0.7,
              backgroundColor: "var(--clr-surface)",
              transition: "opacity 0.15s",
              padding: 0,
            }}
            onMouseOver={(e) => {
              if (!isFirst) (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onMouseOut={(e) => {
              if (!isFirst) (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
            }}
          >
            <KeyboardArrowUpIcon style={{ fontSize: 18, color: "var(--clr-text-muted)" }} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            aria-label={`Move ${displayHeading} section down`}
            style={{
              background: "none",
              border: "1px solid var(--clr-border)",
              borderRadius: "6px",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isLast ? "not-allowed" : "pointer",
              opacity: isLast ? 0.35 : 0.7,
              backgroundColor: "var(--clr-surface)",
              transition: "opacity 0.15s",
              padding: 0,
            }}
            onMouseOver={(e) => {
              if (!isLast) (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onMouseOut={(e) => {
              if (!isLast) (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
            }}
          >
            <KeyboardArrowDownIcon style={{ fontSize: 18, color: "var(--clr-text-muted)" }} />
          </button>
        </div>
      )}

      <div
        className="w-full flex flex-col items-center px-6 sm:px-4"
        style={{ maxWidth: 860, gap: "1.25rem" }}
      >
        {/* Heading row */}
        <div className="flex flex-col items-center animate-in" style={{ gap: "0.75rem" }}>
          {user?.admin && updatable ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 group"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <h2
                className="font-bold text-center group-hover:text-[#5BB8E8] transition-colors"
                style={{
                  fontSize: "1.9rem",
                  lineHeight: 1.2,
                  fontFamily: "'Nunito', sans-serif",
                  color: "var(--clr-text)",
                }}
              >
                {displayHeading}
              </h2>
              <EditOutlinedIcon
                className="transition-colors"
                fontSize="small"
                style={{ color: "var(--clr-text-muted)" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--clr-primary)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--clr-text-muted)")
                }
              />
            </button>
          ) : (
            <h2
              className="font-bold text-center"
              style={{
                fontSize: "1.9rem",
                lineHeight: 1.2,
                fontFamily: "'Nunito', sans-serif",
                color: "var(--clr-text)",
              }}
            >
              {displayHeading}
            </h2>
          )}

          {/* Accent bar with golden dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div
              style={{
                width: 56,
                height: 3,
                borderRadius: 9999,
                backgroundColor: "var(--clr-primary)",
              }}
            />
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "var(--clr-accent)",
                flexShrink: 0,
              }}
            />
          </div>
        </div>

        {content?.subHeading && (
          <p
            className="text-center animate-in-delay-1"
            style={{
              color: "var(--clr-text-muted)",
              fontSize: "1.05rem",
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: 560,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            {content.subHeading}
          </p>
        )}

        {content?.text && (
          <RichText text={content.text} />
        )}

        {children}
      </div>

      {updatable && user?.admin && (
        <EditContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          content={content}
          onSave={setContent}
          user={user}
          deletable={deletable}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
