import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Container, Alert, Box} from "@mui/material";
import {WritingsActionsBar} from "../components/home/WritingsActionsBar";
import {WritingsTable} from "../components/home/WritingsTable";
import {ImagePreviewDialog} from "../components/home/ImagePreviewDialog";
import {UploadFeedback} from "../components/home/UploadFeedback";
import {DeleteConfirmDialog} from "../components/home/DeleteConfirmDialog";
import {DropzoneArea} from "../components/home/DropzoneArea";
import {useAuthStore} from "../stores/authStore";
import {useWritingStore} from "../stores/writingStore";
import {useTableSelection} from "../hooks/useTableSelection";
import {useModalState} from "../hooks/useModalState";
import {useFileUpload} from "../hooks/useFileUpload";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuthStore();
    const {writings, meta, isLoading, error, page, rowsPerPage, fetchWritings, deleteWriting, clearError, subscribeToAllUserWritings, unsubscribeFromAllUserWritings, setPage, setRowsPerPage} =
        useWritingStore();
    const {selectedIds, handleSelectAllChecked, handleSelectOne, clearSelection} = useTableSelection(writings, page, rowsPerPage);
    const {imageModalOpen, selectedImageUrl, deleteModalOpen, deleteModalData, openImageModal, closeImageModal, openDeleteModal, closeDeleteModal} = useModalState();
    const {uploading, uploadSuccess, uploadError, uploadProgress, fileInputRef, handleFileChange, handleFilesDropped, handleUpload, clearUploadSuccess, clearUploadError} = useFileUpload();

    useEffect(() => {
        fetchWritings(page + 1, rowsPerPage);
    }, [page, rowsPerPage, fetchWritings]);

    useEffect(() => {
        subscribeToAllUserWritings();

        return () => {
            unsubscribeFromAllUserWritings();
        };
    }, [subscribeToAllUserWritings, unsubscribeFromAllUserWritings]);

    useEffect(() => {
        if (uploadSuccess) {
            setPage(0);
        }
    }, [uploadSuccess, setPage]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDelete = async (id: number) => {
        openDeleteModal({
            title: "Delete Writing",
            message: "Are you sure you want to delete this writing?",
            onConfirm: async () => {
                try {
                    await deleteWriting(id);
                } catch (err) {
                    console.error("Failed to delete writing:", err);
                }
            },
        });
    };

    const handleView = (id: number) => {
        navigate(`/writing/${id}`);
    };

    const handleRefresh = () => {
        fetchWritings(page + 1, rowsPerPage);
    };

    const handleBatchDelete = async () => {
        if (selectedIds.length === 0) return;

        const confirmMessage = `Are you sure you want to delete ${selectedIds.length} writing${selectedIds.length > 1 ? "s" : ""}?`;
        openDeleteModal({
            title: "Delete Writings",
            message: confirmMessage,
            onConfirm: async () => {
                try {
                    await Promise.all(selectedIds.map(id => deleteWriting(id)));
                    clearSelection();
                } catch (err) {
                    console.error("Failed to delete writings:", err);
                }
            },
        });
    };

    const handleImageClick = (imageUrl: string) => {
        openImageModal(imageUrl);
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
        <DropzoneArea onFilesDropped={handleFilesDropped} hideOverlay={uploading || imageModalOpen}>
            <Container maxWidth="lg">
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4}}>
                    <WritingsActionsBar isLoading={isLoading} uploading={uploading} onRefresh={handleRefresh} onUpload={handleUpload} onLogout={handleLogout} />
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
                    onChangePage={setPage}
                    onChangeRowsPerPage={setRowsPerPage}
                    onView={handleView}
                    onDelete={handleDelete}
                    onBatchDelete={handleBatchDelete}
                    onImageClick={handleImageClick}
                    formatDate={formatDate}
                />

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png" multiple onChange={handleFileChange} style={{display: "none"}} />

                <UploadFeedback
                    uploading={uploading}
                    uploadProgressCurrent={uploadProgress.current}
                    uploadProgressTotal={uploadProgress.total}
                    uploadSuccess={uploadSuccess}
                    onCloseSuccess={clearUploadSuccess}
                    uploadError={uploadError}
                    onCloseError={clearUploadError}
                />

                <ImagePreviewDialog open={imageModalOpen} imageUrl={selectedImageUrl} onClose={closeImageModal} />

                {deleteModalData && (
                    <DeleteConfirmDialog open={deleteModalOpen} onClose={closeDeleteModal} onConfirm={deleteModalData.onConfirm} title={deleteModalData.title} message={deleteModalData.message} />
                )}
            </Container>
        </DropzoneArea>
    );
};
