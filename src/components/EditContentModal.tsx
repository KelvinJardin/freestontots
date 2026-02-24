import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Content } from "@prisma/client";

interface EditContentModalProps {
  open: boolean;
  onClose: () => void;
  content?: Content | null;
  onSave: (updatedContent: Content) => void;
  user?: { id?: string; admin?: boolean };
}

const EditContentModal: React.FC<EditContentModalProps> = ({
  open,
  onClose,
  content,
  onSave,
  user,
}) => {
  const [updatedContent, setUpdatedContent] = useState<Content>(content!);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedContent, user: user?.id }),
      });
      if (!response.ok) throw new Error("Failed to update content");
      const result = await response.json();
      onSave(result);
      onClose();
    } catch (error) {
      console.error("Failed to save content:", error);
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
            Edit: {updatedContent?.heading}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#0ea5e9", mb: 3 }} />

        <TextField
          label="Subheading"
          name="subHeading"
          value={updatedContent?.subHeading || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          multiline
          rows={2}
          size="small"
        />
        <TextField
          label="Text"
          name="text"
          value={updatedContent?.text || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          multiline
          rows={5}
          size="small"
          sx={{ mt: 1.5 }}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
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

export default EditContentModal;
