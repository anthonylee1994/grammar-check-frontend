import {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Box, Container, Alert, Tooltip, IconButton} from "@mui/material";
import {ArrowBack as ArrowBackIcon} from "@mui/icons-material";
import {useWritingStore} from "../stores/writingStore";
import {WritingHeaderCard} from "../components/writingDetail/WritingHeaderCard";
import {WritingImageCard} from "../components/writingDetail/WritingImageCard";
import {WritingTextComparison} from "../components/writingDetail/WritingTextComparison";
import {WritingErrorsTable} from "../components/writingDetail/WritingErrorsTable";
import {WritingFailedCard, WritingPendingCard, WritingProcessingCard} from "../components/writingDetail/WritingStatusCards";
import {formatDate} from "../utils/dateUtils";
import {LoadingSpinner} from "../components/common/LoadingSpinner";
import {GradientBackground} from "../components/layout/GradientBackground";

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

    if (isLoading || !currentWriting) {
        return <LoadingSpinner />;
    }

    return (
        <GradientBackground>
            <Container maxWidth="lg" sx={{px: {xs: 2, sm: 3}, pt: 3, pb: 6}}>
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
        </GradientBackground>
    );
};
