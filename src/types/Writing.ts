export interface WritingError {
    id: number;
    error_type: string;
    original: string;
    correction: string;
    explanation: string;
    position_start: number;
    position_end: number;
}

export interface Writing {
    id: number;
    user_id: number;
    title: string | null;
    original_text: string | null;
    corrected_text: string | null;
    comment: string | null;
    image_url: string | null;
    status: "pending" | "processing" | "completed" | "failed";
    error_count: number;
    created_at: string;
    updated_at: string;
    grammar_errors?: WritingError[];
}

export interface WritingListMeta {
    current_page: number;
    total_pages: number;
    total_count: number;
}
