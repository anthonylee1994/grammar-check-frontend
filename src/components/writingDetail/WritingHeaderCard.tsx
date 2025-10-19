import {Alert, Box, Chip, Paper, Stack, Typography} from "@mui/material";
import type {Writing} from "../../types/Writing";

interface WritingHeaderCardProps {
    writing: Writing;
    formatDate: (date: string) => string;
}

function getStatusColor(status: Writing["status"]) {
    switch (status) {
        case "completed":
            return "success" as const;
        case "processing":
            return "info" as const;
        case "pending":
            return "warning" as const;
        case "failed":
            return "error" as const;
        default:
            return "default" as const;
    }
}

export const WritingHeaderCard = ({writing, formatDate}: WritingHeaderCardProps) => {
    return (
        <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, mb: {xs: 2, md: 3}, borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <Box sx={{display: "flex", flexDirection: {xs: "column", sm: "row"}, justifyContent: "space-between", alignItems: {xs: "flex-start", sm: "flex-start"}, gap: {xs: 2, sm: 0}, mb: 2}}>
                <Box sx={{flex: 1}}>
                    <Typography variant="h4" component="h1" fontWeight={600} gutterBottom sx={{fontSize: {xs: "1.5rem", sm: "2rem"}}}>
                        {writing.title || "Untitled Writing"}
                    </Typography>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={{xs: 1, sm: 2}} alignItems={{xs: "flex-start", sm: "center"}}>
                        <Chip label={writing.status} color={getStatusColor(writing.status)} sx={{textTransform: "capitalize"}} size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                            Created: {formatDate(writing.created_at)}
                        </Typography>
                    </Stack>
                </Box>
                <Box sx={{textAlign: {xs: "left", sm: "center"}, minWidth: {xs: "auto", sm: "100px"}}}>
                    <Typography variant="h3" color="error" fontWeight={700} sx={{fontSize: {xs: "2rem", sm: "3rem"}}}>
                        {writing.error_count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                        Errors Found
                    </Typography>
                </Box>
            </Box>

            {writing.comment && (
                <Alert severity="info" sx={{mt: 2}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Teacher's Comment:
                    </Typography>
                    <Typography variant="body2">{writing.comment}</Typography>
                </Alert>
            )}
        </Paper>
    );
};
