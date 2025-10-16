import {Paper, Typography, Box} from "@mui/material";
import {Image as ImageIcon} from "@mui/icons-material";

interface WritingImageCardProps {
    imageUrl: string;
}

export const WritingImageCard = ({imageUrl}: WritingImageCardProps) => {
    return (
        <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, mb: {xs: 2, md: 3}, borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{display: "flex", alignItems: "center", gap: 1, fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                <ImageIcon sx={{fontSize: {xs: "1.25rem", sm: "1.5rem"}}} /> Original Image
            </Typography>
            <Box sx={{textAlign: "center", mt: {xs: 1.5, sm: 2}}}>
                <img
                    src={imageUrl}
                    alt="Writing"
                    style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                />
            </Box>
        </Paper>
    );
};
