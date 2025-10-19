import {Paper, Typography, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip} from "@mui/material";
import type {WritingError} from "../../types/Writing";

interface WritingErrorsTableProps {
    errors: WritingError[];
}

function getErrorTypeColor(errorType: string) {
    switch (errorType.toLowerCase()) {
        case "spelling":
            return "error" as const;
        case "grammar":
            return "warning" as const;
        case "punctuation":
            return "info" as const;
        case "style":
            return "secondary" as const;
        default:
            return "default" as const;
    }
}

export const WritingErrorsTable = ({errors}: WritingErrorsTableProps) => {
    if (!errors || errors.length === 0) return null;

    return (
        <Paper elevation={8} sx={{p: {xs: 2, sm: 3}, borderRadius: 3, backdropFilter: "blur(6px)", bgcolor: "rgba(255,255,255,0.9)"}}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{fontSize: {xs: "1rem", sm: "1.25rem"}}}>
                Error Details ({errors.length})
            </Typography>
            <Divider sx={{mb: {xs: 1.5, sm: 2}}} />
            <TableContainer sx={{overflowX: "auto"}}>
                <Table sx={{minWidth: {xs: 600, md: 650}}}>
                    <TableHead>
                        <TableRow sx={{backgroundColor: "rgb(255, 250, 250)"}}>
                            <TableCell sx={{fontWeight: 600, width: "5%", px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>#</TableCell>
                            <TableCell sx={{fontWeight: 600, width: "12%", px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>Type</TableCell>
                            <TableCell sx={{fontWeight: 600, width: "20%", px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>Original</TableCell>
                            <TableCell sx={{fontWeight: 600, width: "20%", px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>Correction</TableCell>
                            <TableCell sx={{fontWeight: 600, width: "33%", px: {xs: 1, sm: 2}, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>Explanation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {errors.map((error, index) => (
                            <TableRow key={error.id} hover sx={{"&:last-child td, &:last-child th": {border: 0}}}>
                                <TableCell sx={{px: {xs: 1, sm: 2}}}>
                                    <Typography variant="body2" fontWeight={600} sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                                        {index + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{px: {xs: 1, sm: 2}}}>
                                    <Chip
                                        label={error.error_type.replace("_", " ")}
                                        color={getErrorTypeColor(error.error_type)}
                                        size="small"
                                        sx={{textTransform: "capitalize", fontSize: {xs: "0.625rem", sm: "0.75rem"}, height: {xs: "20px", sm: "24px"}}}
                                    />
                                </TableCell>
                                <TableCell sx={{px: {xs: 1, sm: 2}}}>
                                    <Paper sx={{p: {xs: 1, sm: 1.5}, backgroundColor: "rgba(255, 82, 82, 0.1)", border: "1px solid #ffcdd2"}}>
                                        <Typography variant="body2" sx={{fontWeight: 500, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                                            {error.original}
                                        </Typography>
                                    </Paper>
                                </TableCell>
                                <TableCell sx={{px: {xs: 1, sm: 2}}}>
                                    <Paper sx={{p: {xs: 1, sm: 1.5}, backgroundColor: "rgba(76, 175, 80, 0.1)", border: "1px solid #c8e6c9"}}>
                                        <Typography variant="body2" sx={{fontWeight: 500, fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                                            {error.correction}
                                        </Typography>
                                    </Paper>
                                </TableCell>
                                <TableCell sx={{px: {xs: 1, sm: 2}}}>
                                    <Typography variant="body2" sx={{fontSize: {xs: "0.75rem", sm: "0.875rem"}}}>
                                        {error.explanation}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
