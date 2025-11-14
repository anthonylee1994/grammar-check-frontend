import {Box, Divider, Paper, Typography} from "@mui/material";
import type {WritingError} from "../../types/Writing";
import {Tooltip} from "@mui/material";

interface WritingTextComparisonProps {
    originalText: string | null;
    correctedText: string | null;
    errors: WritingError[] | undefined;
}

const HighlightedOriginal = ({text, errors}: {text: string | null; errors: WritingError[] | undefined}) => {
    const renderPlainText = () => (
        <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
            {text || "No text available"}
        </Typography>
    );

    if (!text || !errors?.length) return renderPlainText();

    // Build non-overlapping error regions
    const errorRegions = errors
        .reduce<Array<{start: number; end: number; error: WritingError}>>((acc, error) => {
            if (!error.original) return acc;

            const foundIndex = text.toLowerCase().indexOf(error.original.toLowerCase());
            if (foundIndex === -1) return acc;

            const end = foundIndex + error.original.length;
            const hasOverlap = acc.some(region => foundIndex < region.end && end > region.start);

            if (!hasOverlap) {
                acc.push({start: foundIndex, end, error});
            }
            return acc;
        }, [])
        .sort((a, b) => a.start - b.start);

    // Build text segments with error highlights
    const segments = errorRegions.reduce<React.ReactElement[]>((acc, {start, end, error}, idx) => {
        const lastEnd = idx === 0 ? 0 : errorRegions[idx - 1].end;

        if (start > lastEnd) {
            acc.push(<span key={`text-${idx}`}>{text.slice(lastEnd, start)}</span>);
        }

        acc.push(
            <Tooltip
                key={`error-${idx}`}
                title={
                    <Box>
                        <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 0.5}}>
                            {error.error_type.replace("_", " ").toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{mb: 0.5}}>
                            <strong>Original:</strong> {error.original}
                        </Typography>
                        <Typography variant="body2" sx={{mb: 0.5}}>
                            <strong>Correction:</strong> {error.correction}
                        </Typography>
                        <Typography variant="caption">{error.explanation}</Typography>
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
                    {text.slice(start, end)}
                </Box>
            </Tooltip>
        );

        // Add trailing text after last error
        if (idx === errorRegions.length - 1 && end < text.length) {
            acc.push(<span key="text-end">{text.slice(end)}</span>);
        }

        return acc;
    }, []);

    return (
        <Typography variant="body1" component="div" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
            {segments}
        </Typography>
    );
};

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
