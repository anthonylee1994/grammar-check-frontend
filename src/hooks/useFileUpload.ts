import {useState, useRef} from "react";
import {useWritingStore} from "../stores/writingStore";

export const useFileUpload = () => {
    const {uploadImage} = useWritingStore();
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState({current: 0, total: 0});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = (files: File[]): string | null => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 25 * 1024 * 1024; // 25MB

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                return `${file.name} is not a valid file type. Please select only JPG or PNG images.`;
            }
            if (file.size > maxSize) {
                return `${file.name} exceeds the 10MB size limit.`;
            }
        }
        return null;
    };

    const uploadFiles = async (files: File[]) => {
        const validationError = validateFiles(files);
        if (validationError) {
            setUploadError(validationError);
            return;
        }

        setUploading(true);
        setUploadProgress({current: 0, total: files.length});

        let successCount = 0;
        let failedCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setUploadProgress({current: i + 1, total: files.length});

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        await uploadFiles(Array.from(files));
    };

    const handleFilesDropped = async (files: FileList) => {
        if (!files || files.length === 0) return;
        await uploadFiles(Array.from(files));
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const clearUploadSuccess = () => setUploadSuccess(false);
    const clearUploadError = () => setUploadError(null);

    return {
        uploading,
        uploadSuccess,
        uploadError,
        uploadProgress,
        fileInputRef,
        handleFileChange,
        handleFilesDropped,
        handleUpload,
        clearUploadSuccess,
        clearUploadError,
    };
};
