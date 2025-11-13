import {useState, useEffect} from "react";
import {Popover, Box, Typography, CircularProgress, IconButton, Tooltip} from "@mui/material";
import {AttachMoney as AttachMoneyIcon} from "@mui/icons-material";
import {Gauge} from "@mui/x-charts/Gauge";
import {apiClient} from "../../utils/apiClient";
import React from "react";

interface CreditUsageGaugeProps {
    disabled?: boolean;
}

interface CreditData {
    total_credits: number;
    total_usage: number;
}

export const CreditUsageGauge = ({disabled = false}: CreditUsageGaugeProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [creditData, setCreditData] = useState<CreditData | null>(null);
    const [loading, setLoading] = useState(false);

    const open = Boolean(anchorEl);
    const id = open ? "credit-usage-popover" : undefined;

    const fetchCreditData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<CreditData>("/api/v1/credits");
            setCreditData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch credit data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCreditData();
        }
    }, [open]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const calculatePercentage = () => {
        if (!creditData) return 0;
        const total = creditData.total_credits + creditData.total_usage;
        if (total === 0) return 0;
        return (creditData.total_usage / total) * 100;
    };

    const getGaugeColor = (percentage: number) => {
        if (percentage < 25) return "#4caf50"; // Green
        if (percentage < 50) return "#ff9800"; // Orange
        return "#f44336"; // Red
    };

    const percentage = calculatePercentage();
    const gaugeColor = getGaugeColor(percentage);

    return (
        <React.Fragment>
            <Tooltip title="Credit Usage">
                <span>
                    <IconButton onClick={handleClick} disabled={disabled} aria-describedby={id}>
                        <AttachMoneyIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 5,
                        },
                    },
                }}
            >
                <Box sx={{p: 2, minWidth: 300, maxWidth: 400}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                        <Typography variant="h6" component="h2">
                            Credits
                        </Typography>
                    </Box>

                    <React.Fragment>
                        {/* Gauge Circle */}
                        <Box sx={{display: "flex", justifyContent: "center", mb: 3}}>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Gauge
                                    width={200}
                                    height={200}
                                    value={loading ? 0 : 100 - percentage}
                                    valueMin={0}
                                    valueMax={100}
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    sx={{
                                        [`& .MuiGauge-valueArc`]: {
                                            fill: gaugeColor,
                                            transition: "fill 0.3s ease",
                                        },
                                        [`& .MuiGauge-referenceArc`]: {
                                            fill: "#e0e0e0",
                                        },
                                        [`& .MuiGauge-valueText`]: {
                                            fontSize: "2rem",
                                            fontWeight: "bold",
                                            fill: gaugeColor,
                                        },
                                    }}
                                    text={({value}) => (value !== null ? `${value.toFixed(1)}%` : "0%")}
                                />
                            )}
                        </Box>

                        {creditData && !loading && (
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Available Credits:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" color="success.main">
                                        ${creditData.total_credits.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <Typography variant="body2" color="text.secondary">
                                        Usage:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" color="error.main">
                                        ${creditData.total_usage.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        pt: 2,
                                        borderTop: "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                        Total:
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ${(creditData.total_credits - creditData.total_usage).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </React.Fragment>
                </Box>
            </Popover>
        </React.Fragment>
    );
};
