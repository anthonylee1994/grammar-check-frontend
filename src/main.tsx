import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ThemeProvider, createTheme, CssBaseline} from "@mui/material";
import {App} from "./app";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
    typography: {
        fontFamily: ["Roboto", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </StrictMode>
);
