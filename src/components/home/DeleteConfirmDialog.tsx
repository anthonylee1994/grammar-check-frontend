import React from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button} from "@mui/material";

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({open, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel"}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{color: "text.secondary"}}>
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{cancelText}</Button>
                <Button color="error" onClick={handleConfirm}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
