import React from "react";
import {Box, Container, Paper, Avatar, Typography, Alert, Divider} from "@mui/material";

interface AuthFormLayoutProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    error?: string | null;
    children: React.ReactNode;
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({title, subtitle, icon, error, children}) => {
    return (
        <Container component="main" maxWidth="xs" sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: {xs: 3, sm: 4},
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        borderRadius: 3,
                        backdropFilter: "blur(6px)",
                        bgcolor: "rgba(255,255,255,0.9)",
                    }}
                >
                    <Avatar sx={{bgcolor: "primary.main", width: 56, height: 56, mb: 2}}>{icon}</Avatar>
                    <Typography component="h1" variant="h4" sx={{mb: 0.5, fontWeight: 700}}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                        {subtitle}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{width: "100%", mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <Divider sx={{width: "100%", mb: 2}} />
                    {children}
                </Paper>
            </Box>
        </Container>
    );
};
