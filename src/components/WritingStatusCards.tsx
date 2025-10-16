import {Paper, Typography, CircularProgress, Alert} from "@mui/material";

export const WritingProcessingCard = () => {
    return (
        <Paper elevation={8} sx={{p: {xs: 3, sm: 4}, textAlign: "center", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <CircularProgress sx={{mb: 2}} />
            <Typography variant="h6" gutterBottom sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                Processing the Writing...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                This page will automatically update when processing is complete.
            </Typography>
        </Paper>
    );
};

export const WritingPendingCard = () => {
    return (
        <Paper elevation={8} sx={{p: {xs: 3, sm: 4}, textAlign: "center", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <CircularProgress sx={{mb: 2}} />
            <Typography variant="h6" gutterBottom sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                Waiting to Process...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                This page will automatically update when processing is complete.
            </Typography>
        </Paper>
    );
};

export const WritingFailedCard = ({message}: {message?: string}) => {
    return (
        <Paper elevation={8} sx={{p: {xs: 2, sm: 4}, borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <Alert severity="error">
                <Typography variant="h6" gutterBottom sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                    Processing Failed
                </Typography>
                <Typography variant="body2" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                    {message || "An error occurred while processing your writing. Please try uploading again."}
                </Typography>
            </Alert>
        </Paper>
    );
};
