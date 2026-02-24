"use client";

import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditContentModal from "@/components/EditContentModal";
import { Content } from "@prisma/client";

interface SectionProps {
  style?: React.CSSProperties;
  heading: string;
  content: Content;
  children?: React.ReactNode;
  user?: { id?: string; admin?: boolean };
  updatable: boolean;
}

export default function Section({
  style,
  heading,
  content: sectionContent,
  children,
  user,
  updatable,
}: SectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState<Content | null | undefined>(sectionContent);

  const displayHeading = content?.heading || heading;

  return (
    <div
      className="flex flex-col items-center"
      style={{ ...style, paddingTop: "4rem", paddingBottom: "4rem" }}
      id={(content?.heading || heading).replace(" ", "-")}
    >
      <div
        className="w-full flex flex-col items-center px-6 sm:px-4"
        style={{ maxWidth: 860, gap: "1.25rem" }}
      >
        {/* Heading row */}
        <div className="flex flex-col items-center" style={{ gap: "0.6rem" }}>
          {user?.admin && updatable ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 group"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <h2
                className="font-bold text-gray-800 font-inter group-hover:text-sky-500 transition-colors"
                style={{ fontSize: "1.9rem", lineHeight: 1.2 }}
              >
                {displayHeading}
              </h2>
              <EditOutlinedIcon
                className="text-gray-400 group-hover:text-sky-500 transition-colors"
                fontSize="small"
              />
            </button>
          ) : (
            <h2
              className="font-bold text-gray-800 font-inter text-center"
              style={{ fontSize: "1.9rem", lineHeight: 1.2 }}
            >
              {displayHeading}
            </h2>
          )}

          {/* Accent bar */}
          <div
            style={{
              width: 40,
              height: 3,
              borderRadius: 9999,
              backgroundColor: "#0ea5e9",
            }}
          />
        </div>

        {content?.subHeading && (
          <p
            className="text-center font-inter"
            style={{
              color: "#64748b",
              fontSize: "1.05rem",
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            {content.subHeading}
          </p>
        )}

        {content?.text && (
          <p
            className="text-center font-inter"
            style={{
              color: "#475569",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              maxWidth: 680,
            }}
          >
            {content.text.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
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
        />
      )}
    </div>
  );
}
