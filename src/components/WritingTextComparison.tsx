import {Box, Divider, Paper, Typography} from "@mui/material";
import type {WritingError} from "../types/Writing";
import {Tooltip} from "@mui/material";

interface WritingTextComparisonProps {
    originalText: string | null;
    correctedText: string | null;
    errors: WritingError[] | undefined;
}

function HighlightedOriginal({text, errors}: {text: string | null; errors: WritingError[] | undefined}) {
    if (!text || !errors || errors.length === 0) {
        return (
            <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
                {text || "No text available"}
            </Typography>
        );
    }

    const errorMap: Map<number, WritingError> = new Map();
    const processedErrors: Array<{start: number; end: number; error: WritingError}> = [];

    errors.forEach(error => {
        if (!error.original) return;

        let searchIndex = 0;
        while (searchIndex < text.length) {
            const foundIndex = text.indexOf(error.original, searchIndex);
            if (foundIndex === -1) break;

            let isOverlapping = false;
            for (let i = foundIndex; i < foundIndex + error.original.length; i++) {
                if (errorMap.has(i)) {
                    isOverlapping = true;
                    break;
                }
            }

            if (!isOverlapping) {
                for (let i = foundIndex; i < foundIndex + error.original.length; i++) {
                    errorMap.set(i, error);
                }
                processedErrors.push({start: foundIndex, end: foundIndex + error.original.length, error});
                break; // Only highlight first occurrence of each error
            }

            searchIndex = foundIndex + 1;
        }
    });

    processedErrors.sort((a, b) => a.start - b.start);

    const segments: React.ReactElement[] = [];
    let lastIndex = 0;

    processedErrors.forEach((item, idx) => {
        if (item.start > lastIndex) {
            segments.push(<span key={`text-${idx}`}>{text.slice(lastIndex, item.start)}</span>);
        }

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
                        "&:hover": {backgroundColor: "rgba(255, 82, 82, 0.3)"},
                    }}
                >
                    {text.slice(item.start, item.end)}
                </Box>
            </Tooltip>
        );

        lastIndex = item.end;
    });

    if (lastIndex < text.length) {
        segments.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return (
        <Typography variant="body1" component="div" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
            {segments}
        </Typography>
    );
}

export const WritingTextComparison = ({originalText, correctedText, errors}: WritingTextComparisonProps) => {
    return (
        <Box sx={{display: "flex", gap: {xs: 2, md: 3}, mb: {xs: 2, md: 3}, flexDirection: {xs: "column", md: "row"}}}>
            <Box sx={{flex: 1}}>
                <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, height: "100%", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="error" sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                        Original Text (with errors highlighted)
                    </Typography>
                    <Divider sx={{mb: {xs: 1.5, sm: 2}}} />
                    <HighlightedOriginal text={originalText} errors={errors} />
                </Paper>
            </Box>
            <Box sx={{flex: 1}}>
                <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, height: "100%", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(237, 247, 237, 0.9)"}}>
                    <Typography variant="h6" fontWeight={600} gutterBottom color="success.main" sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                        Corrected Text
                    </Typography>
                    <Divider sx={{mb: {xs: 1.5, sm: 2}}} />
                    <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
                        {correctedText || "No corrected text available"}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};
