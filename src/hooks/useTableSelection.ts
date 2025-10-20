import {useState, useEffect} from "react";
import type {Writing} from "../types/Writing";

export const useTableSelection = (writings: Writing[], page: number, rowsPerPage: number) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        setSelectedIds([]);
    }, [page, rowsPerPage]);

    const handleSelectAllChecked = (checked: boolean) => {
        if (checked) {
            const allIds = writings.map(writing => writing.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const clearSelection = () => setSelectedIds([]);

    return {
        selectedIds,
        handleSelectAllChecked,
        handleSelectOne,
        clearSelection,
    };
};
