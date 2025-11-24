import React from "react";
import {Box} from "@mui/material";

interface GradientBackgroundProps {
    children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({children}) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #FFF8E1 100%)",
                px: 2,
            }}
        >
            {children}
        </Box>
    );
};
