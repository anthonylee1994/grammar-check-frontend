import {Alert, Snackbar} from "@mui/material";
import React from "react";

interface UploadFeedbackProps {
    uploading: boolean;
    uploadProgressCurrent: number;
    uploadProgressTotal: number;
    uploadSuccess: boolean;
    onCloseSuccess: () => void;
    uploadError: string | null;
    onCloseError: () => void;
}

export const UploadFeedback = ({uploading, uploadProgressCurrent, uploadProgressTotal, uploadSuccess, onCloseSuccess, uploadError, onCloseError}: UploadFeedbackProps) => {
    const successMessage =
        uploadProgressTotal > 1 ? `${uploadProgressTotal} images uploaded successfully! Processing will begin shortly.` : "Image uploaded successfully! Processing will begin shortly.";
    return (
        <React.Fragment>
            <Snackbar open={uploading} message={`Uploading ${uploadProgressCurrent} of ${uploadProgressTotal} file(s)...`} anchorOrigin={{vertical: "bottom", horizontal: "center"}} />

            <Snackbar open={uploadSuccess} autoHideDuration={4000} onClose={onCloseSuccess} message={successMessage} anchorOrigin={{vertical: "bottom", horizontal: "center"}} />

            <Snackbar open={!!uploadError} autoHideDuration={4000} onClose={onCloseError} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
                <Alert severity="error" onClose={onCloseError} sx={{width: "100%"}}>
                    {uploadError}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};
