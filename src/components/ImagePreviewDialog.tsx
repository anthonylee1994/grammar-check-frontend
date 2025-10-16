import {Box, Dialog} from "@mui/material";

interface ImagePreviewDialogProps {
    open: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export const ImagePreviewDialog = ({open, imageUrl, onClose}: ImagePreviewDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                },
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                },
            }}
        >
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "90vw", height: "90vh", cursor: "pointer", overflow: "hidden"}} onClick={onClose}>
                {imageUrl && (
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="Writing preview"
                        sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                            borderRadius: 2,
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                            cursor: "default",
                        }}
                        onClick={e => e.stopPropagation()}
                    />
                )}
            </Box>
        </Dialog>
    );
};
