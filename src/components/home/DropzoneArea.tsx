import React, {useState, useRef} from "react";
import {Box} from "@mui/material";
import {DropzoneOverlay} from "./DropzoneOverlay";

interface DropzoneAreaProps {
    children: React.ReactNode;
    onFilesDropped: (files: FileList) => void;
    className?: string;
    style?: React.CSSProperties;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({children, onFilesDropped, className, style}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFilesDropped(files);
        }
    };

    return (
        <Box
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #FFF8E1 100%)",
                py: 4,
                px: 2,
                position: "relative",
                ...style,
            }}
            className={className}
        >
            {children}
            <DropzoneOverlay isVisible={isDragging} />
        </Box>
    );
};
