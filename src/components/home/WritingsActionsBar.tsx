import {Box, IconButton, Tooltip} from "@mui/material";
import {CloudUpload as CloudUploadIcon, Refresh as RefreshIcon, LogoutRounded} from "@mui/icons-material";
import {CreditUsageGauge} from "./CreditUsageGauge";

interface WritingsActionsBarProps {
    isLoading: boolean;
    uploading: boolean;
    onRefresh: () => void;
    onUpload: () => void;
    onLogout: () => void;
}

export const WritingsActionsBar = ({isLoading, uploading, onRefresh, onUpload, onLogout}: WritingsActionsBarProps) => {
    return (
        <Box sx={{width: "100%", display: "flex", gap: 1, alignItems: "center", justifyContent: "flex-end"}}>
            <CreditUsageGauge disabled={isLoading} />
            <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} disabled={isLoading}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Upload new writing(s)">
                <IconButton onClick={onUpload} disabled={isLoading || uploading}>
                    <CloudUploadIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
                <IconButton onClick={onLogout} disabled={isLoading}>
                    <LogoutRounded />
                </IconButton>
            </Tooltip>
        </Box>
    );
};
