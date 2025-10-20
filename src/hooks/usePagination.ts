import {useState} from "react";

export const usePagination = (initialPage = 0, initialRowsPerPage = 10) => {
    const [page, setPage] = useState(initialPage);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page when changing rows per page
    };

    return {
        page,
        rowsPerPage,
        handlePageChange,
        handleRowsPerPageChange,
    };
};
