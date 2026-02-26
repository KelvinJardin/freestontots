"use client";

import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Content } from "@prisma/client";

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (newContent: Content) => void;
  user?: { id?: string; admin?: boolean };
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  open,
  onClose,
  onCreated,
  user,
}) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setHeading("");
    setSubHeading("");
    setText("");
    setError(null);
    onClose();
  };

  const handleSave = async () => {
    if (!heading.trim()) {
      setError("Section title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          userId: user?.id,
          heading: heading.trim(),
          subHeading: subHeading.trim() || undefined,
          text: text.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create section");
      }
      const newContent: Content = await response.json();
      onCreated(newContent);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create section");
    } finally {
      setSaving(false);
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
          width: { xs: "92vw", sm: 460 },
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
            Add New Section
          </Typography>
          <IconButton size="small" onClick={handleClose} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

        <TextField
          label="Section Title"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          fullWidth
          required
          margin="dense"
          size="small"
          error={!!error && !heading.trim()}
          helperText={!!error && !heading.trim() ? error : undefined}
        />
        <TextField
          label="Subheading"
          value={subHeading}
          onChange={(e) => setSubHeading(e.target.value)}
          fullWidth
          margin="dense"
          multiline
          rows={2}
          size="small"
          sx={{ mt: 1.5 }}
        />
        <TextField
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          margin="dense"
          multiline
          rows={5}
          size="small"
          sx={{ mt: 1.5 }}
        />

        {error && heading.trim() && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            size="small"
            disabled={saving}
            sx={{ borderColor: "#e2e8f0", color: "#64748b", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            size="small"
            disabled={saving}
            sx={{
              bgcolor: "#5BB8E8",
              color: "#fff",
              "&:hover": { bgcolor: "#3DA3D9", color: "#fff" },
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            {saving ? "Creating..." : "Create Section"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddSectionModal;
