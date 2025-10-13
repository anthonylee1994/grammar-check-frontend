import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography, Paper, Alert, Link as MuiLink} from "@mui/material";
import {useAuthStore} from "../stores/authStore";

interface LoginFormData {
    username: string;
    password: string;
}

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(data.username, data.password);
            navigate("/"); // Redirect to home page after successful login
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "rgb(247, 251, 255)"}}>
            <Container component="main" maxWidth="xs" sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Typography component="h1" variant="h4" sx={{mb: 3, fontWeight: 600}}>
                            Sign In
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{width: "100%", mb: 2}}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{width: "100%"}}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Username"
                                autoComplete="username"
                                autoFocus
                                {...register("username", {
                                    required: "Username is required",
                                })}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                margin="normal"
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                loading={isLoading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                                disabled={isLoading}
                            >
                                Sign In
                            </Button>

                            <Box sx={{textAlign: "center", mt: 2}}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{" "}
                                    <MuiLink
                                        component="button"
                                        variant="body2"
                                        onClick={() => navigate("/register")}
                                        sx={{
                                            textDecoration: "none",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Sign Up
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};
