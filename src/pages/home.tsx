import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Container, Alert} from "@mui/material";
import {WritingsActionsBar} from "../components/WritingsActionsBar";
import {WritingsTable} from "../components/WritingsTable";
import {ImagePreviewDialog} from "../components/ImagePreviewDialog";
import {UploadFeedback} from "../components/UploadFeedback";
import {useAuthStore} from "../stores/authStore";
import {useWritingStore} from "../stores/writingStore";
// import type {Writing} from "../types/Writing"; // no longer needed in this file

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuthStore();
    const {writings, meta, isLoading, error, fetchWritings, deleteWriting, uploadImage, clearError} = useWritingStore();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({current: 0, total: 0});
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchWritings(page + 1, rowsPerPage);
    }, [page, rowsPerPage, fetchWritings]);

    useEffect(() => {
        setSelectedIds([]);
    }, [page, rowsPerPage]);

    const handleLogout = () => {
        logout();
        navigate("/login");
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

    const handleSelectAllChecked = (checked: boolean) => {
        if (checked) {
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
                await Promise.all(selectedIds.map(id => deleteWriting(id)));
                setSelectedIds([]);
            } catch (err) {
                console.error("Failed to delete writings:", err);
            }
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setImageModalOpen(false);
        setSelectedImageUrl(null);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const filesArray = Array.from(files);

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

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (successCount > 0 && failedCount === 0) {
            setUploadSuccess(true);
        } else if (successCount > 0 && failedCount > 0) {
            setUploadError(`${successCount} file(s) uploaded successfully, but ${failedCount} failed: ${errors.join(", ")}`);
        } else {
            setUploadError(`Failed to upload all files: ${errors.join(", ")}`);
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
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #FFF8E1 100%)",
                py: 4,
                px: 2,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}>
                    <WritingsActionsBar
                        selectedCount={selectedIds.length}
                        isLoading={isLoading}
                        uploading={uploading}
                        onBatchDelete={handleBatchDelete}
                        onRefresh={handleRefresh}
                        onUpload={handleUpload}
                        onLogout={handleLogout}
                    />
                </Box>

                {error && (
                    <Alert severity="error" onClose={clearError} sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}

                <WritingsTable
                    writings={writings}
                    meta={meta}
                    isLoading={isLoading}
                    selectedIds={selectedIds}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onSelectAll={handleSelectAllChecked}
                    onSelectOne={handleSelectOne}
                    onChangePage={newPage => setPage(newPage)}
                    onChangeRowsPerPage={newRows => {
                        setRowsPerPage(newRows);
                        setPage(0);
                    }}
                    onView={handleView}
                    onDelete={handleDelete}
                    onImageClick={handleImageClick}
                    formatDate={formatDate}
                />

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" multiple onChange={handleFileChange} style={{display: "none"}} />

                <UploadFeedback
                    uploading={uploading}
                    uploadProgressCurrent={uploadProgress.current}
                    uploadProgressTotal={uploadProgress.total}
                    uploadSuccess={uploadSuccess}
                    onCloseSuccess={() => setUploadSuccess(false)}
                    uploadError={uploadError}
                    onCloseError={() => setUploadError(null)}
                />

                <ImagePreviewDialog open={imageModalOpen} imageUrl={selectedImageUrl} onClose={handleCloseImageModal} />
            </Container>
        </Box>
    );
};
