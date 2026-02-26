import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { OpenTimes } from "@prisma/client";

interface EditOpenTimesModalProps {
  open: boolean;
  onClose: () => void;
  times: OpenTimes[];
  onSave: (updated: OpenTimes[]) => void;
  user?: { id?: string; admin?: boolean };
}

const EditOpenTimesModal: React.FC<EditOpenTimesModalProps> = ({
  open,
  onClose,
  times,
  onSave,
  user,
}) => {
  const [rows, setRows] = useState<OpenTimes[]>(times);

  const handleChange = (index: number, field: keyof OpenTimes, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/open-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ times: rows, userId: user?.id }),
      });
      if (!response.ok) throw new Error("Failed to update open times");
      const result = await response.json();
      onSave(result);
      onClose();
    } catch (error) {
      console.error("Failed to save open times:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92vw", sm: 560 },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          p: { xs: 3, sm: 4 },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
            Edit Open Times
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

        {rows.map((row, index) => (
          <Box key={row.id} sx={{ mb: 3 }}>

              {
                  (index === 0) &&
                  <Box sx={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 1.5, mb: 0.75 }}>
                      <span />
                      <Typography fontSize="0.72rem" fontWeight={600} color="text.secondary" textAlign="center" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Open</Typography>
                      <Typography fontSize="0.72rem" fontWeight={600} color="text.secondary" textAlign="center" sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Close</Typography>
                  </Box>
              }
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1.5, color: "#5BB8E8", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {row.day}
            </Typography>


            <Box sx={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Typography fontSize="0.8rem" color="text.secondary">Morning</Typography>
              <TextField
                value={row.morningOpen ?? ""}
                onChange={(e) => handleChange(index, "morningOpen", e.target.value)}
                size="small"
                placeholder="08:30"
                inputProps={{ style: { textAlign: "center", padding: "5px" } }}
                sx={{ minWidth: 0 }}
              />
              <TextField
                value={row.morningClose ?? ""}
                onChange={(e) => handleChange(index, "morningClose", e.target.value)}
                size="small"
                placeholder="11:30"
                inputProps={{ style: { textAlign: "center", padding: "5px" } }}
                sx={{ minWidth: 0 }}
              />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", alignItems: "center", gap: 1.5 }}>
              <Typography fontSize="0.8rem" color="text.secondary">Afternoon</Typography>
              <TextField
                value={row.afternoonOpen ?? ""}
                onChange={(e) => handleChange(index, "afternoonOpen", e.target.value)}
                size="small"
                placeholder="12:30"
                inputProps={{ style: { textAlign: "center", padding: "5px" } }}
                sx={{ minWidth: 0 }}
              />
              <TextField
                value={row.afternoonClose ?? ""}
                onChange={(e) => handleChange(index, "afternoonClose", e.target.value)}
                size="small"
                placeholder="15:30"
                inputProps={{ style: { textAlign: "center", padding: "5px" } }}
                sx={{ minWidth: 0 }}
              />
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            size="small"
            sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            size="small"
            sx={{
              bgcolor: "#5BB8E8",
              color: "#fff",
              "&:hover": { bgcolor: "#3DA3D9", color: "#fff" },
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditOpenTimesModal;
