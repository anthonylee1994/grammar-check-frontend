import {Box} from "@mui/material";

interface DropzoneOverlayProps {
    isVisible: boolean;
}

export const DropzoneOverlay: React.FC<DropzoneOverlayProps> = ({isVisible}) => {
    if (!isVisible) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    border: "4px dashed white",
                    borderRadius: "16px",
                    padding: "60px 80px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <Box
                    sx={{
                        fontSize: "72px",
                        mb: 2,
                        textAlign: "center",
                    }}
                >
                    📤
                </Box>
                <Box
                    sx={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                        mb: 1,
                    }}
                >
                    Drop images here
                </Box>
                <Box
                    sx={{
                        fontSize: "18px",
                        color: "rgba(255, 255, 255, 0.9)",
                        textAlign: "center",
                    }}
                >
                    JPG or PNG files (max 25MB each)
                </Box>
            </Box>
        </Box>
    );
};
