import {Box, Button, IconButton, Tooltip} from "@mui/material";
import {DeleteSweep as DeleteSweepIcon, CloudUpload as CloudUploadIcon, Refresh as RefreshIcon, LogoutRounded} from "@mui/icons-material";

interface WritingsActionsBarProps {
    selectedCount: number;
    isLoading: boolean;
    uploading: boolean;
    onBatchDelete: () => void;
    onRefresh: () => void;
    onUpload: () => void;
    onLogout: () => void;
}

export const WritingsActionsBar = ({selectedCount, isLoading, uploading, onBatchDelete, onRefresh, onUpload, onLogout}: WritingsActionsBarProps) => {
    return (
        <Box sx={{width: "100%", display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between"}}>
            <Box sx={{display: "flex"}}>
                {selectedCount > 0 && (
                    <Button variant="contained" color="error" size="small" startIcon={<DeleteSweepIcon />} onClick={onBatchDelete} disabled={isLoading} sx={{mr: 1}}>
                        Delete ({selectedCount})
                    </Button>
                )}
            </Box>
            <Box sx={{display: "flex", gap: 1}}>
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
        </Box>
    );
};
