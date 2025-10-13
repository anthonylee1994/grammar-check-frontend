import {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Box, Container, Typography, Button, Paper, Chip, CircularProgress, Alert, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import {ArrowBack as ArrowBackIcon, Image as ImageIcon} from "@mui/icons-material";
import {useAuthStore} from "../stores/authStore";
import {useWritingStore} from "../stores/writingStore";
import type {Writing, WritingError} from "../types/Writing";

export const WritingDetailPage: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const {isAuthenticated} = useAuthStore();
    const {currentWriting, isLoading, error, fetchWriting, subscribeToWriting, unsubscribeFromWriting} = useWritingStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (id) {
            const writingId = parseInt(id, 10);
            fetchWriting(writingId);
            subscribeToWriting(writingId);
        }

        return () => {
            unsubscribeFromWriting();
        };
    }, [id, isAuthenticated, navigate, fetchWriting, subscribeToWriting, unsubscribeFromWriting]);

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

    const getErrorTypeColor = (errorType: string) => {
        switch (errorType.toLowerCase()) {
            case "spelling":
                return "error";
            case "grammar":
                return "warning";
            case "punctuation":
                return "info";
            case "style":
                return "secondary";
            default:
                return "default";
        }
    };

    const highlightErrors = (text: string | null, errors: WritingError[] = []) => {
        if (!text || errors.length === 0) {
            return (
                <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8}}>
                    {text || "No text available"}
                </Typography>
            );
        }

        // Create a map to track which characters are part of an error
        const errorMap: Map<number, WritingError> = new Map();
        const processedErrors: Array<{start: number; end: number; error: WritingError}> = [];

        // Find all occurrences of error.original in the text
        errors.forEach(error => {
            if (!error.original) return;

            let searchIndex = 0;
            while (searchIndex < text.length) {
                const foundIndex = text.indexOf(error.original, searchIndex);
                if (foundIndex === -1) break;

                // Check if this position is not already marked by another error
                let isOverlapping = false;
                for (let i = foundIndex; i < foundIndex + error.original.length; i++) {
                    if (errorMap.has(i)) {
                        isOverlapping = true;
                        break;
                    }
                }

                // If not overlapping, mark this error
                if (!isOverlapping) {
                    for (let i = foundIndex; i < foundIndex + error.original.length; i++) {
                        errorMap.set(i, error);
                    }
                    processedErrors.push({
                        start: foundIndex,
                        end: foundIndex + error.original.length,
                        error: error,
                    });
                    break; // Only highlight first occurrence of each error
                }

                searchIndex = foundIndex + 1;
            }
        });

        // Sort errors by start position
        processedErrors.sort((a, b) => a.start - b.start);

        // Build segments
        const segments: React.ReactElement[] = [];
        let lastIndex = 0;

        processedErrors.forEach((item, idx) => {
            // Add text before this error
            if (item.start > lastIndex) {
                segments.push(<span key={`text-${idx}`}>{text.slice(lastIndex, item.start)}</span>);
            }

            // Add highlighted error text with tooltip
            segments.push(
                <Tooltip
                    key={`error-${idx}`}
                    title={
                        <Box>
                            <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 0.5}}>
                                {item.error.error_type.replace("_", " ").toUpperCase()}
                            </Typography>
                            <Typography variant="body2" sx={{mb: 0.5}}>
                                <strong>Original:</strong> {item.error.original}
                            </Typography>
                            <Typography variant="body2" sx={{mb: 0.5}}>
                                <strong>Correction:</strong> {item.error.correction}
                            </Typography>
                            <Typography variant="caption">{item.error.explanation}</Typography>
                        </Box>
                    }
                    arrow
                    placement="top"
                >
                    <Box
                        component="span"
                        sx={{
                            backgroundColor: "rgba(255, 82, 82, 0.2)",
                            borderBottom: "2px solid #ff5252",
                            padding: "2px 4px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "rgba(255, 82, 82, 0.3)",
                            },
                        }}
                    >
                        {text.slice(item.start, item.end)}
                    </Box>
                </Tooltip>
            );

            lastIndex = item.end;
        });

        // Add remaining text after the last error
        if (lastIndex < text.length) {
            segments.push(<span key="text-end">{text.slice(lastIndex)}</span>);
        }

        return (
            <Typography variant="body1" component="div" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8}}>
                {segments}
            </Typography>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading || !currentWriting) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{minHeight: "100vh", backgroundColor: "rgb(247, 251, 255)", py: 4}}>
            <Container maxWidth="lg">
                <Box sx={{mb: 3}}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} variant="outlined">
                        Back
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}

                {/* Header Card */}
                <Paper elevation={2} sx={{p: 3, mb: 3}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2}}>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                                {currentWriting.title || "Untitled Writing"}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Chip label={currentWriting.status} color={getStatusColor(currentWriting.status)} sx={{textTransform: "capitalize"}} />
                                <Typography variant="body2" color="text.secondary">
                                    Created: {formatDate(currentWriting.created_at)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Updated: {formatDate(currentWriting.updated_at)}
                                </Typography>
                            </Stack>
                        </Box>
                        <Box sx={{textAlign: "center"}}>
                            <Typography variant="h3" color="error" fontWeight={700}>
                                {currentWriting.error_count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Errors Found
                            </Typography>
                        </Box>
                    </Box>

                    {currentWriting.comment && (
                        <Alert severity="info" sx={{mt: 2}}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Teacher's Comment:
                            </Typography>
                            <Typography variant="body2">{currentWriting.comment}</Typography>
                        </Alert>
                    )}
                </Paper>

                {/* Image */}
                {currentWriting.image_url && (
                    <Paper elevation={2} sx={{p: 3, mb: 3}}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <ImageIcon /> Original Image
                        </Typography>
                        <Box sx={{textAlign: "center", mt: 2}}>
                            <img
                                src={currentWriting.image_url}
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
                )}

                {/* Text Comparison */}
                {currentWriting.status === "completed" && (
                    <Box sx={{display: "flex", gap: 3, mb: 3, flexDirection: {xs: "column", md: "row"}}}>
                        {/* Original Text */}
                        <Box sx={{flex: 1}}>
                            <Paper elevation={2} sx={{p: 3, height: "100%"}}>
                                <Typography variant="h6" fontWeight={600} gutterBottom color="error">
                                    Original Text (with errors highlighted)
                                </Typography>
                                <Divider sx={{mb: 2}} />
                                {highlightErrors(currentWriting.original_text, currentWriting.grammar_errors)}
                            </Paper>
                        </Box>

                        {/* Corrected Text */}
                        <Box sx={{flex: 1}}>
                            <Paper elevation={2} sx={{p: 3, height: "100%", backgroundColor: "rgb(237, 247, 237)"}}>
                                <Typography variant="h6" fontWeight={600} gutterBottom color="success.main">
                                    Corrected Text
                                </Typography>
                                <Divider sx={{mb: 2}} />
                                <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8}}>
                                    {currentWriting.corrected_text || "No corrected text available"}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                )}

                {/* Errors Table */}
                {currentWriting.grammar_errors && currentWriting.grammar_errors.length > 0 && (
                    <Paper elevation={2} sx={{p: 3}}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Error Details ({currentWriting.grammar_errors.length})
                        </Typography>
                        <Divider sx={{mb: 2}} />
                        <TableContainer>
                            <Table sx={{minWidth: 650}}>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: "rgb(255, 250, 250)"}}>
                                        <TableCell sx={{fontWeight: 600, width: "5%"}}>#</TableCell>
                                        <TableCell sx={{fontWeight: 600, width: "12%"}}>Type</TableCell>
                                        <TableCell sx={{fontWeight: 600, width: "20%"}}>Original</TableCell>
                                        <TableCell sx={{fontWeight: 600, width: "20%"}}>Correction</TableCell>
                                        <TableCell sx={{fontWeight: 600, width: "33%"}}>Explanation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentWriting.grammar_errors.map((error, index) => (
                                        <TableRow key={error.id} hover sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {index + 1}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={error.error_type.replace("_", " ")} color={getErrorTypeColor(error.error_type)} size="small" sx={{textTransform: "capitalize"}} />
                                            </TableCell>
                                            <TableCell>
                                                <Paper sx={{p: 1.5, backgroundColor: "rgba(255, 82, 82, 0.1)", border: "1px solid #ffcdd2"}}>
                                                    <Typography variant="body2" sx={{fontWeight: 500}}>
                                                        {error.original}
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                            <TableCell>
                                                <Paper sx={{p: 1.5, backgroundColor: "rgba(76, 175, 80, 0.1)", border: "1px solid #c8e6c9"}}>
                                                    <Typography variant="body2" sx={{fontWeight: 500}}>
                                                        {error.correction}
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{error.explanation}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {/* Processing/Pending State */}
                {(currentWriting.status === "pending" || currentWriting.status === "processing") && (
                    <Paper elevation={2} sx={{p: 4, textAlign: "center"}}>
                        <CircularProgress sx={{mb: 2}} />
                        <Typography variant="h6" gutterBottom>
                            {currentWriting.status === "pending" ? "Waiting to Process..." : "Processing Your Writing..."}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This page will automatically update when processing is complete.
                        </Typography>
                    </Paper>
                )}

                {/* Failed State */}
                {currentWriting.status === "failed" && (
                    <Paper elevation={2} sx={{p: 4}}>
                        <Alert severity="error">
                            <Typography variant="h6" gutterBottom>
                                Processing Failed
                            </Typography>
                            <Typography variant="body2">{currentWriting.comment || "An error occurred while processing your writing. Please try uploading again."}</Typography>
                        </Alert>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};
