import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Snackbar,
    Tooltip,
    Checkbox,
    Button,
} from "@mui/material";
import {Delete as DeleteIcon, Visibility as VisibilityIcon, CloudUpload as CloudUploadIcon, Refresh as RefreshIcon, LogoutRounded, DeleteSweep as DeleteSweepIcon} from "@mui/icons-material";
import {useAuthStore} from "../stores/authStore";
import {useWritingStore} from "../stores/writingStore";
import type {Writing} from "../types/Writing";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated, logout} = useAuthStore();
    const {writings, meta, isLoading, error, fetchWritings, deleteWriting, uploadImage, clearError} = useWritingStore();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({current: 0, total: 0});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWritings(page + 1, rowsPerPage);
        }
    }, [isAuthenticated, page, rowsPerPage, fetchWritings]);

    // Clear selections when writings change (e.g., after refresh or page change)
    useEffect(() => {
        setSelectedIds([]);
    }, [page, rowsPerPage]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this writing?")) {
            try {
                await deleteWriting(id);
            } catch (err) {
                console.error("Failed to delete writing:", err);
            }
        }
    };

    const handleView = (id: number) => {
        navigate(`/writing/${id}`);
    };

    const handleRefresh = () => {
        fetchWritings(page + 1, rowsPerPage);
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allIds = writings.map(writing => writing.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleBatchDelete = async () => {
        if (selectedIds.length === 0) return;

        const confirmMessage = `Are you sure you want to delete ${selectedIds.length} writing${selectedIds.length > 1 ? "s" : ""}?`;
        if (window.confirm(confirmMessage)) {
            try {
                // Delete all selected writings
                await Promise.all(selectedIds.map(id => deleteWriting(id)));
                setSelectedIds([]);
            } catch (err) {
                console.error("Failed to delete writings:", err);
            }
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const filesArray = Array.from(files);

        // Validate all files before uploading
        for (const file of filesArray) {
            if (!validTypes.includes(file.type)) {
                setUploadError(`${file.name} is not a valid file type. Please select only JPG or PNG images.`);
                return;
            }
            if (file.size > maxSize) {
                setUploadError(`${file.name} exceeds the 10MB size limit.`);
                return;
            }
        }

        setUploading(true);
        setUploadProgress({current: 0, total: filesArray.length});

        let successCount = 0;
        let failedCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            setUploadProgress({current: i + 1, total: filesArray.length});

            try {
                await uploadImage(file);
                successCount++;
            } catch (err) {
                failedCount++;
                errors.push(file.name);
                console.error(`Failed to upload ${file.name}:`, err);
            }
        }

        setUploading(false);

        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Show appropriate message
        if (successCount > 0 && failedCount === 0) {
            setUploadSuccess(true);
        } else if (successCount > 0 && failedCount > 0) {
            setUploadError(`${successCount} file(s) uploaded successfully, but ${failedCount} failed: ${errors.join(", ")}`);
        } else {
            setUploadError(`Failed to upload all files: ${errors.join(", ")}`);
        }
    };

    const getStatusColor = (status: Writing["status"]) => {
        switch (status) {
            case "completed":
                return "success";
            case "processing":
                return "info";
            case "pending":
                return "warning";
            case "failed":
                return "error";
            default:
                return "default";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user) {
        return null;
    }

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", backgroundColor: "rgb(247, 251, 255)", py: 4}}>
            <Container maxWidth="lg">
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}>
                    <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                        {selectedIds.length > 0 && (
                            <Button variant="contained" color="error" size="small" startIcon={<DeleteSweepIcon />} onClick={handleBatchDelete} disabled={isLoading} sx={{mr: 1}}>
                                Delete ({selectedIds.length})
                            </Button>
                        )}
                        <Tooltip title="Refresh">
                            <IconButton onClick={handleRefresh} disabled={isLoading}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Upload new writing(s)">
                            <IconButton onClick={handleUpload} disabled={isLoading || uploading}>
                                <CloudUploadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton onClick={handleLogout} disabled={isLoading}>
                                <LogoutRounded />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" onClose={clearError} sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}

                <Paper elevation={2} sx={{width: "100%", overflow: "hidden"}}>
                    <TableContainer>
                        <Table sx={{minWidth: 650}}>
                            <TableHead>
                                <TableRow sx={{backgroundColor: "rgb(239, 246, 255)"}}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < writings.length}
                                            checked={writings.length > 0 && selectedIds.length === writings.length}
                                            onChange={handleSelectAll}
                                            disabled={isLoading || writings.length === 0}
                                        />
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
                                        <TableCell colSpan={6} align="center" sx={{py: 8}}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : writings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{py: 8}}>
                                            <Typography color="text.secondary">No writings found. Upload your first writing to get started!</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    writings.map(writing => (
                                        <TableRow key={writing.id} hover sx={{"&:last-child td, &:last-child th": {border: 0}}} selected={selectedIds.includes(writing.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedIds.includes(writing.id)} onChange={() => handleSelectOne(writing.id)} />
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
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleView(writing.id)}
                                                    title="View details"
                                                    sx={{
                                                        mr: {xs: 0, md: 1},
                                                    }}
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(writing.id)} title="Delete">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
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
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </Paper>

                {/* Hidden file input */}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" multiple onChange={handleFileChange} style={{display: "none"}} />

                {/* Upload progress notification */}
                <Snackbar open={uploading} message={`Uploading ${uploadProgress.current} of ${uploadProgress.total} file(s)...`} anchorOrigin={{vertical: "bottom", horizontal: "center"}} />

                {/* Success notification */}
                <Snackbar
                    open={uploadSuccess}
                    autoHideDuration={4000}
                    onClose={() => setUploadSuccess(false)}
                    message={
                        uploadProgress.total > 1
                            ? `${uploadProgress.total} images uploaded successfully! Processing will begin shortly.`
                            : "Image uploaded successfully! Processing will begin shortly."
                    }
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                />

                {/* Upload error notification */}
                <Snackbar open={!!uploadError} autoHideDuration={4000} onClose={() => setUploadError(null)} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                    <Alert severity="error" onClose={() => setUploadError(null)} sx={{width: "100%"}}>
                        {uploadError}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};
