import React from "react";
import {Box, Divider, Paper, Tooltip, Typography} from "@mui/material";
import type {WritingError} from "../../types/Writing";

interface WritingTextComparisonProps {
    originalText: string | null;
    correctedText: string | null;
    errors: WritingError[] | undefined;
}

interface ErrorRegion {
    start: number;
    end: number;
    error: WritingError;
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildOriginalTextPattern(original: string) {
    return original.trim().split(/\s+/).filter(Boolean).map(escapeRegExp).join("\\s+");
}

function getErrorRegions(text: string, errors: WritingError[]) {
    return errors
        .reduce<ErrorRegion[]>((acc, error) => {
            if (!error.original.trim()) return acc;

            const pattern = buildOriginalTextPattern(error.original);
            if (!pattern) return acc;

            const match = new RegExp(pattern, "i").exec(text);
            if (!match?.[0]) return acc;

            acc.push({start: match.index, end: match.index + match[0].length, error});
            return acc;
        }, [])
        .sort((a, b) => a.start - b.start || b.end - a.end);
}

function getSegmentErrors(errorRegions: ErrorRegion[], start: number, end: number) {
    return errorRegions.filter(region => start < region.end && end > region.start).map(region => region.error);
}

function renderTooltipTitle(segmentErrors: WritingError[]) {
    return (
        <Box>
            {segmentErrors.map((error, index) => (
                <Box key={error.id} sx={{mt: index === 0 ? 0 : 1}}>
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
            ))}
        </Box>
    );
}

function HighlightedOriginal({text, errors}: {text: string | null; errors: WritingError[] | undefined}) {
    const renderPlainText = () => (
        <Typography variant="body1" sx={{whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: {xs: "0.875rem", sm: "1rem"}}}>
            {text || "No text available"}
        </Typography>
    );

    if (!text || !errors?.length) return renderPlainText();

    const errorRegions = getErrorRegions(text, errors);
    if (!errorRegions.length) return renderPlainText();

    const boundaries = Array.from(new Set([0, text.length, ...errorRegions.flatMap(region => [region.start, region.end])])).sort((a, b) => a - b);

    const segments = boundaries.slice(0, -1).reduce<React.ReactElement[]>((acc, start, index) => {
        const end = boundaries[index + 1];
        const segmentText = text.slice(start, end);
        const segmentErrors = getSegmentErrors(errorRegions, start, end);

        if (!segmentErrors.length) {
            acc.push(<span key={`text-${start}-${end}`}>{segmentText}</span>);
            return acc;
        }

        acc.push(
            <Tooltip key={`error-${start}-${end}`} title={renderTooltipTitle(segmentErrors)} arrow placement="top">
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
                    {segmentText}
                </Box>
            </Tooltip>
        );

        return acc;
    }, []);

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
                    <Typography variant="h6" gutterBottom color="error" sx={{fontWeight: 600, fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                        Original Text (with errors highlighted)
                    </Typography>
                    <Divider sx={{mb: {xs: 1.5, sm: 2}}} />
                    <HighlightedOriginal text={originalText} errors={errors} />
                </Paper>
            </Box>
            <Box sx={{flex: 1}}>
                <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, height: "100%", borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(237, 247, 237, 0.9)"}}>
                    <Typography variant="h6" gutterBottom color="success.main" sx={{fontWeight: 600, fontSize: {xs: "1rem", sm: "1.25rem"}}}>
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
