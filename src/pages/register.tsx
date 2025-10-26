import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography, Paper, Alert, Link as MuiLink, InputAdornment, IconButton, Divider, Avatar} from "@mui/material";
import {Visibility, VisibilityOff, AppRegistration as RegisterIcon} from "@mui/icons-material";
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                            <RegisterIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{mb: 0.5, fontWeight: 700}}>
                            Create account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                            Join to get started
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
                                type={showPassword ? "text" : "password"}
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

                            <TextField
                                margin="normal"
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                autoComplete="new-password"
                                {...registerField("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match",
                                })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle confirm password visibility" onClick={() => setShowConfirmPassword(prev => !prev)} edge="end">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                disabled={isLoading || isCheckingUsername || !!usernameError}
                                loading={isLoading}
                            >
                                Sign Up
                            </Button>

                            <Box sx={{textAlign: "center", mt: 2}}>
                                <Typography variant="body2" color="text.secondary" sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <span>Already have an account? </span>
                                    <MuiLink
                                        component="button"
                                        type="button"
                                        variant="body2"
                                        onClick={() => navigate("/login")}
                                        sx={{
                                            marginLeft: 1,
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
