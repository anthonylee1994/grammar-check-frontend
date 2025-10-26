import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography, Paper, Alert, Link as MuiLink, InputAdornment, IconButton, Divider, Avatar} from "@mui/material";
import {Visibility, VisibilityOff, Login as LoginIcon} from "@mui/icons-material";
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
    const [showPassword, setShowPassword] = useState(false);

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
                        <Avatar sx={{bgcolor: "primary.main", width: 56, height: 56, mb: 2}}>
                            <LoginIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{mb: 0.5, fontWeight: 700}}>
                            Welcome back
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                            Sign in to continue
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{width: "100%", mb: 2}}>
                                {error}
                            </Alert>
                        )}

                        <Divider sx={{width: "100%", mb: 2}} />
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
                                type={showPassword ? "text" : "password"}
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
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(prev => !prev)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Sign In
                            </Button>

                            <Box sx={{textAlign: "center", mt: 2}}>
                                <Typography variant="body2" color="text.secondary" sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <span>Don't have an account? </span>
                                    <MuiLink
                                        component="button"
                                        type="button"
                                        variant="body2"
                                        onClick={() => navigate("/register")}
                                        sx={{
                                            marginLeft: 1,
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
