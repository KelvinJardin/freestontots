import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { Content } from '@prisma/client';

interface EditContentModalProps {
    open: boolean;
    onClose: () => void;
    content: Content | null | undefined;
    onSave: (updatedContent: Content) => void;
}

const EditContentModal: React.FC<EditContentModalProps> = ({ open, onClose, content, onSave }) => {
    const [updatedContent, setUpdatedContent] = useState<Content>(content!);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedContent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedContent),
            });

            if (!response.ok) {
                throw new Error('Failed to update content');
            }

            const result = await response.json();
            onSave(result);
            onClose();
        } catch (error) {
            console.error('Failed to save content:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit {updatedContent?.heading}
                </Typography>
                <TextField
                    label="Subheading"
                    name="subHeading"
                    value={updatedContent?.subHeading || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                />
                <TextField
                    label="Text"
                    name="text"
                    value={updatedContent?.text || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" color="success" onClick={handleSave} sx={{ float: 'right' }}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditContentModal;
