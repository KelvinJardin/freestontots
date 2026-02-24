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
          width: { xs: "92vw", sm: 520 },
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

        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#0ea5e9", mb: 3 }} />

        {rows.map((row, index) => (
          <Box key={row.id} sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1.5, color: "#0ea5e9", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {row.day}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <TextField
                label="Morning open"
                value={row.morningOpen ?? ""}
                onChange={(e) => handleChange(index, "morningOpen", e.target.value)}
                size="small"
                sx={{ flex: "1 1 110px", minWidth: 100 }}
              />
              <TextField
                label="Morning close"
                value={row.morningClose ?? ""}
                onChange={(e) => handleChange(index, "morningClose", e.target.value)}
                size="small"
                sx={{ flex: "1 1 110px", minWidth: 100 }}
              />
              <TextField
                label="Afternoon open"
                value={row.afternoonOpen ?? ""}
                onChange={(e) => handleChange(index, "afternoonOpen", e.target.value)}
                size="small"
                sx={{ flex: "1 1 110px", minWidth: 100 }}
              />
              <TextField
                label="Afternoon close"
                value={row.afternoonClose ?? ""}
                onChange={(e) => handleChange(index, "afternoonClose", e.target.value)}
                size="small"
                sx={{ flex: "1 1 110px", minWidth: 100 }}
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
              bgcolor: "#0ea5e9",
              color: "#fff",
              "&:hover": { bgcolor: "#0284c7", color: "#fff" },
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
