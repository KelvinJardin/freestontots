import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { OpenTimes } from '@prisma/client';

interface EditOpenTimesModalProps {
    open: boolean;
    onClose: () => void;
    times: OpenTimes[];
    onSave: (updated: OpenTimes[]) => void;
    user?: { id?: string; admin?: boolean };
}

const EditOpenTimesModal: React.FC<EditOpenTimesModalProps> = ({ open, onClose, times, onSave, user }) => {
    const [rows, setRows] = useState<OpenTimes[]>(times);

    const handleChange = (index: number, field: keyof OpenTimes, value: string) => {
        setRows((prev) => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/open-times', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ times: rows, userId: user?.id }),
            });

            if (!response.ok) throw new Error('Failed to update open times');

            const result = await response.json();
            onSave(result);
            onClose();
        } catch (error) {
            console.error('Failed to save open times:', error);
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
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Open Times
                </Typography>
                {rows.map((row, index) => (
                    <Box key={row.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>{row.day}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                label="Morning Open"
                                value={row.morningOpen ?? ''}
                                onChange={(e) => handleChange(index, 'morningOpen', e.target.value)}
                                size="small"
                            />
                            <TextField
                                label="Morning Close"
                                value={row.morningClose ?? ''}
                                onChange={(e) => handleChange(index, 'morningClose', e.target.value)}
                                size="small"
                            />
                            <TextField
                                label="Afternoon Open"
                                value={row.afternoonOpen ?? ''}
                                onChange={(e) => handleChange(index, 'afternoonOpen', e.target.value)}
                                size="small"
                            />
                            <TextField
                                label="Afternoon Close"
                                value={row.afternoonClose ?? ''}
                                onChange={(e) => handleChange(index, 'afternoonClose', e.target.value)}
                                size="small"
                            />
                        </Box>
                    </Box>
                ))}
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

export default EditOpenTimesModal;
