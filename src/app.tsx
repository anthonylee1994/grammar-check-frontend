import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login";
import {RegisterPage} from "./pages/register";
import {HomePage} from "./pages/home";
import {WritingDetailPage} from "./pages/writingDetail";

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/writing/:id" element={<WritingDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
