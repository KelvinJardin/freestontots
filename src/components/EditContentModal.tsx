import React, { useRef, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Content } from "@prisma/client";

interface EditContentModalProps {
  open: boolean;
  onClose: () => void;
  content?: Content | null;
  onSave: (updatedContent: Content) => void;
  user?: { id?: string; admin?: boolean };
  deletable?: boolean;
  onDelete?: () => void;
}

const EditContentModal: React.FC<EditContentModalProps> = ({
  open,
  onClose,
  content,
  onSave,
  user,
  deletable,
  onDelete,
}) => {
  const [updatedContent, setUpdatedContent] = useState<Content>(content!);
  const [uploadingImage, setUploadingImage] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleInsertImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Reset so the same file can be picked again if needed
    e.target.value = "";

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/content-images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();

      const token = `![image](${url})`;

      // Insert at cursor position in the textarea
      const textarea = textareaRef.current;
      const currentText = updatedContent?.text ?? "";

      let newText: string;
      let newCursorPos: number;

      if (textarea) {
        const start = textarea.selectionStart ?? currentText.length;
        const end = textarea.selectionEnd ?? currentText.length;
        newText = currentText.slice(0, start) + token + currentText.slice(end);
        newCursorPos = start + token.length;
      } else {
        newText = currentText + token;
        newCursorPos = newText.length;
      }

      setUpdatedContent((prev) => ({ ...prev, text: newText }));

      // Restore cursor position after React re-renders
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploadingImage(false);
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

        <Box sx={{ width: 32, height: 3, borderRadius: 9, bgcolor: "#5BB8E8", mb: 3 }} />

        <TextField
          label="Heading"
          name="heading"
          value={updatedContent?.heading || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          size="small"
        />

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

        {/* Toolbar row above Text field */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 1.5,
            mb: 0.5,
          }}
        >
          <Tooltip title="Insert image" placement="left">
            <span>
              <IconButton
                size="small"
                onClick={handleInsertImageClick}
                disabled={uploadingImage}
                aria-label="Insert image at cursor"
                sx={{
                  color: "#5BB8E8",
                  border: "1px solid #C0DCEA",
                  borderRadius: 1.5,
                  width: 30,
                  height: 30,
                  "&:hover": { backgroundColor: "#EAF5FD", borderColor: "#5BB8E8" },
                  "&.Mui-disabled": { opacity: 0.5 },
                }}
              >
                {uploadingImage ? (
                  <CircularProgress size={14} sx={{ color: "#5BB8E8" }} />
                ) : (
                  <ImageIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>

        <TextField
          label="Text"
          name="text"
          value={updatedContent?.text || ""}
          onChange={handleChange}
          fullWidth
          margin="none"
          multiline
          rows={5}
          size="small"
          inputRef={textareaRef}
        />

        <Box sx={{ mt: 3, display: "flex", gap: 1.5, alignItems: "center", justifyContent: "space-between" }}>
          {/* Delete button — left side, only when deletable */}
          {deletable && onDelete ? (
            <Button
              variant="outlined"
              onClick={handleDelete}
              size="small"
              sx={{
                borderColor: "#fca5a5",
                color: "#dc2626",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              Delete Section
            </Button>
          ) : (
            <Box />
          )}

          {/* Cancel + Save — right side */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
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
      </Box>
    </Modal>
  );
};

export default EditContentModal;
