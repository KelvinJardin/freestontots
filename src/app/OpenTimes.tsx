"use client";

import React, { useState } from "react";
import { OpenTimes } from "@prisma/client";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditOpenTimesModal from "@/components/EditOpenTimesModal";

interface OpenTimesProps {
  times: OpenTimes[];
  user?: { id?: string; admin?: boolean };
}

function fmt(t: string | null | undefined): string {
  return t ?? "—";
}

export default function OpenTimesContainer({ times, user }: OpenTimesProps) {
  const [rows, setRows] = useState<OpenTimes[]>(times);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full" style={{ maxWidth: 520, marginTop: "0.5rem" }}>
      {/* Table card */}
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 8px rgba(45,36,25,0.08), 0 1px 2px rgba(45,36,25,0.04)",
          border: "1px solid var(--clr-border)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--clr-primary)" }}>
              {["Day", "Morning", "Afternoon"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((time, index) => (
              <tr
                key={time.id}
                style={{ backgroundColor: index % 2 === 0 ? "#fff" : "var(--clr-surface)" }}
              >
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--clr-text)",
                    borderBottom: "1px solid var(--clr-border)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {time.day}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    color: "var(--clr-text-muted)",
                    borderBottom: "1px solid var(--clr-border)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {fmt(time.morningOpen)} &ndash; {fmt(time.morningClose)}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    color: "var(--clr-text-muted)",
                    borderBottom: "1px solid var(--clr-border)",
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  {fmt(time.afternoonOpen)} &ndash; {fmt(time.afternoonClose)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.admin && (
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 transition-colors"
          style={{
            marginTop: 10,
            marginLeft: "auto",
            display: "flex",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--clr-text-muted)",
            fontSize: "0.82rem",
            padding: 0,
            fontFamily: "'Lato', sans-serif",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--clr-primary)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--clr-text-muted)")}
        >
          <EditOutlinedIcon fontSize="small" />
          <span>Edit times</span>
        </button>
      )}

      {user?.admin && (
        <EditOpenTimesModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          times={rows}
          onSave={setRows}
          user={user}
        />
      )}
    </div>
  );
}
