import {Avatar, Chip, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, Checkbox, Paper} from "@mui/material";
import {Delete as DeleteIcon, Visibility as VisibilityIcon} from "@mui/icons-material";
import type {Writing, WritingListMeta} from "../../types/Writing";

interface WritingsTableProps {
    writings: Writing[];
    meta: WritingListMeta | null;
    isLoading: boolean;
    selectedIds: number[];
    rowsPerPage: number;
    page: number;
    onSelectAll: (checked: boolean) => void;
    onSelectOne: (id: number) => void;
    onChangePage: (newPage: number) => void;
    onChangeRowsPerPage: (newRows: number) => void;
    onView: (id: number) => void;
    onDelete: (id: number) => void;
    onImageClick: (url: string) => void;
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

export const WritingsTable = ({
    writings,
    meta,
    isLoading,
    selectedIds,
    rowsPerPage,
    page,
    onSelectAll,
    onSelectOne,
    onChangePage,
    onChangeRowsPerPage,
    onView,
    onDelete,
    onImageClick,
    formatDate,
}: WritingsTableProps) => {
    return (
        <Paper elevation={8} sx={{width: "100%", overflow: "hidden", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <TableContainer>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow sx={{backgroundColor: "rgb(239, 246, 255)"}}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < writings.length}
                                    checked={writings.length > 0 && selectedIds.length === writings.length}
                                    onChange={e => onSelectAll(e.target.checked)}
                                    disabled={isLoading || writings.length === 0}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Preview
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Title
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Errors
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Created
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{py: 8}}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : writings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{py: 8}}>
                                    <Typography color="text.secondary">No writings found. Upload your first writing to get started!</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            writings.map(writing => (
                                <TableRow key={writing.id} hover sx={{"&:last-child td, &:last-child th": {border: 0}}} selected={selectedIds.includes(writing.id)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selectedIds.includes(writing.id)} onChange={() => onSelectOne(writing.id)} />
                                    </TableCell>
                                    <TableCell>
                                        {writing.image_url ? (
                                            <Avatar
                                                src={writing.image_url}
                                                variant="rounded"
                                                sx={{width: 60, height: 40, cursor: "pointer", "&:hover": {transform: "scale(1.05)", transition: "transform 0.2s ease-in-out"}}}
                                                onClick={() => writing.image_url && onImageClick(writing.image_url)}
                                            />
                                        ) : (
                                            <Avatar variant="rounded" sx={{width: 60, height: 40, bgcolor: "grey.200", color: "grey.500"}}>
                                                <Typography variant="caption" fontSize="10px">
                                                    No Image
                                                </Typography>
                                            </Avatar>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {writing.title || "Untitled"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={writing.status} color={getStatusColor(writing.status)} size="small" sx={{textTransform: "capitalize"}} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">{writing.error_count}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(writing.created_at)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View details">
                                            <IconButton size="small" color="primary" onClick={() => onView(writing.id)} title="View details" sx={{mr: {xs: 0, md: 1}}}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => onDelete(writing.id)} title="Delete">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {meta && meta.total_count > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={meta.total_count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_e, newPage) => onChangePage(newPage)}
                    onRowsPerPageChange={e => onChangeRowsPerPage(parseInt(e.target.value, 10))}
                />
            )}
        </Paper>
    );
};
