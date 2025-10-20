import {useState} from "react";

export const useModalState = () => {
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const openImageModal = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setImageModalOpen(false);
        setSelectedImageUrl(null);
    };

    const openDeleteModal = (data: {title: string; message: string; onConfirm: () => void}) => {
        setDeleteModalData(data);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDeleteModalData(null);
    };

    return {
        imageModalOpen,
        selectedImageUrl,
        deleteModalOpen,
        deleteModalData,
        openImageModal,
        closeImageModal,
        openDeleteModal,
        closeDeleteModal,
    };
};
