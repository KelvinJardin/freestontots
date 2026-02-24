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
          boxShadow: "0 1px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          border: "1px solid #e2e8f0",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0ea5e9" }}>
              {["Day", "Morning", "Afternoon"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
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
                style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f0f9ff" }}
              >
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "#334155",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {time.day}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    color: "#475569",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {fmt(time.morningOpen)} – {fmt(time.morningClose)}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    color: "#475569",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {fmt(time.afternoonOpen)} – {fmt(time.afternoonClose)}
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
            color: "#94a3b8",
            fontSize: "0.82rem",
            padding: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0ea5e9")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#94a3b8")}
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
