import {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Box, Container, CircularProgress, Alert, Tooltip, IconButton} from "@mui/material";
import {ArrowBack as ArrowBackIcon} from "@mui/icons-material";
import {useWritingStore} from "../stores/writingStore";
import {WritingHeaderCard} from "../components/writingDetail/WritingHeaderCard";
import {WritingImageCard} from "../components/writingDetail/WritingImageCard";
import {WritingTextComparison} from "../components/writingDetail/WritingTextComparison";
import {WritingErrorsTable} from "../components/writingDetail/WritingErrorsTable";
import {WritingFailedCard, WritingPendingCard, WritingProcessingCard} from "../components/writingDetail/WritingStatusCards";

export const WritingDetailPage: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const {currentWriting, isLoading, error, fetchWriting, subscribeToWriting, unsubscribeFromWriting} = useWritingStore();

    useEffect(() => {
        if (id) {
            const writingId = parseInt(id, 10);
            fetchWriting(writingId);
            subscribeToWriting(writingId);
        }

        return () => {
            unsubscribeFromWriting();
        };
    }, [id, fetchWriting, subscribeToWriting, unsubscribeFromWriting]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading || !currentWriting) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #FFF8E1 100%)",
                py: {xs: 2, sm: 3, md: 4},
                px: 2,
            }}
        >
            <Container maxWidth="lg" sx={{px: {xs: 2, sm: 3}}}>
                <Box sx={{mb: {xs: 2, md: 3}}}>
                    <Tooltip title="Back">
                        <IconButton onClick={() => navigate("/")}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {error && (
                    <Alert severity="error" sx={{mb: 3}}>
                        {error}
                    </Alert>
                )}

                <WritingHeaderCard writing={currentWriting} formatDate={formatDate} />

                {currentWriting.image_url && <WritingImageCard imageUrl={currentWriting.image_url} />}

                {currentWriting.status === "completed" && (
                    <WritingTextComparison originalText={currentWriting.original_text} correctedText={currentWriting.corrected_text} errors={currentWriting.grammar_errors} />
                )}

                {currentWriting.grammar_errors && currentWriting.grammar_errors.length > 0 && <WritingErrorsTable errors={currentWriting.grammar_errors} />}

                {(currentWriting.status === "pending" || currentWriting.status === "processing") && (currentWriting.status === "pending" ? <WritingPendingCard /> : <WritingProcessingCard />)}

                {currentWriting.status === "failed" && <WritingFailedCard message={currentWriting.comment || undefined} />}
            </Container>
        </Box>
    );
};
