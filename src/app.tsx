import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login";
import {RegisterPage} from "./pages/register";
import {HomePage} from "./pages/home";
import {WritingDetailPage} from "./pages/writingDetail";
import {AuthGuard} from "./components/shared/AuthGuard";

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/"
                    element={
                        <AuthGuard>
                            <HomePage />
                        </AuthGuard>
                    }
                />
                <Route
                    path="/writing/:id"
                    element={
                        <AuthGuard>
                            <WritingDetailPage />
                        </AuthGuard>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
