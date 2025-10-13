import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography, Paper, Alert, Link as MuiLink} from "@mui/material";
import {useAuthStore} from "../stores/authStore";

interface RegisterFormData {
    username: string;
    password: string;
    confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const register = useAuthStore(state => state.register);
    const checkUsernameExists = useAuthStore(state => state.checkUsernameExists);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const {
        register: registerField,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm<RegisterFormData>({
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");
    const username = watch("username");

    // Debounced username existence check
    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length === 0) {
                setUsernameError(null);
                return;
            }

            setIsCheckingUsername(true);
            setUsernameError(null);

            try {
                const exists = await checkUsernameExists(username);
                if (exists) {
                    setUsernameError("Username is already taken");
                } else {
                    setUsernameError(null);
                }
            } catch (err) {
                // Silently fail - user can still try to submit
                console.error("Error checking username:", err);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        // Debounce the check by 500ms
        const timeoutId = setTimeout(checkUsername, 500);

        return () => clearTimeout(timeoutId);
    }, [username, checkUsernameExists]);

    const onSubmit = async (data: RegisterFormData) => {
        // Prevent submission if username is taken
        if (usernameError) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await register(data.username, data.password);
            navigate("/"); // Redirect to home page after successful registration
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
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
                            Sign Up
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
                                {...registerField("username", {
                                    required: "Username is required",
                                })}
                                error={!!errors.username || !!usernameError}
                                helperText={errors.username?.message || usernameError}
                                disabled={isLoading}
                            />

                            <TextField
                                margin="normal"
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                {...registerField("password", {
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

                            <TextField
                                margin="normal"
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                {...registerField("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match",
                                })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
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
                                disabled={isLoading || isCheckingUsername || !!usernameError}
                            >
                                Sign Up
                            </Button>

                            <Box sx={{textAlign: "center", mt: 2}}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{" "}
                                    <MuiLink
                                        component="button"
                                        variant="body2"
                                        onClick={() => navigate("/login")}
                                        sx={{
                                            textDecoration: "none",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Sign In
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
