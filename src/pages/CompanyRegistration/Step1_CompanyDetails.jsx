import React, { useState } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    MenuItem,
    Divider,
    Alert,
} from "@mui/material";

import { useTranslation } from "react-i18next";
// TODO: Import searchCompany when API is ready
// import { searchCompany } from "../../api/companyApi";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Custom theme for DatePicker
const datePickerTheme = createTheme({
    palette: {
        primary: {
            main: "#1d466dff",
        },
    },
});

export default function Step1_CompanyDetails({ formData, setFormData, next }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    const [errors, setErrors] = useState({
        crNumber: false,
        occiNumber: false,
        occiExpiry: false,
        yearsToRenew: false,
        degree: false,
        riydaExpiry: false
        
    });

    const [showAlert, setShowAlert] = useState(false);

    const handleBlur = (fieldName, value) => {
        setErrors({
            ...errors,
            [fieldName]: !value || (typeof value === 'string' && value.trim() === "")
        });
    };

    const validateAllFields = () => {
        const newErrors = {
            crNumber: !formData.crNumber || formData.crNumber.trim() === "",
            occiNumber: !formData.occiNumber || formData.occiNumber.trim() === "",
            occiExpiry: !formData.occiExpiry,
            yearsToRenew: !formData.yearsToRenew,
            degree: !formData.degree,
            riydaExpiry: !formData.riydaExpiry
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSearch = () => {
        if (!validateAllFields()) {
            setShowAlert(true);
            return;
        }

        setShowAlert(false);

        // TODO: API call will be integrated here later
        // For now, just proceed to next step for UI development
        console.log("Form data submitted (API integration pending):", {
            crNumber: formData.crNumber,
            occiNumber: formData.occiNumber,
            occiExpiry: formData.occiExpiry,
            yearsToRenew: formData.yearsToRenew,
            degree: formData.degree,
        });

        // Proceed to next step
        next();
    };

    // Reusable TextField styling
    const textFieldSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            transition: "all 0.3s ease",
            height: "56px",
            "& fieldset": {
                borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
                borderColor: "#1d466dff",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1d466dff",
                boxShadow: "0 4px 12px rgba(29, 70, 109, 0.15)",
            },
        },
        "& .MuiInputBase-input": {
            textAlign: isRTL ? 'right' : 'left',
            fontSize: "14px",
            fontWeight: 500,
            padding: "16px 14px",
        },
        "& .MuiInputLabel-root": {
            textAlign: isRTL ? 'right' : 'left',
            transformOrigin: isRTL ? 'top right' : 'top left',
            backgroundColor: "#ffffff",
            paddingLeft: isRTL ? "0px" : "4px",
            paddingRight: isRTL ? "4px" : "0px",
            paddingTop: "0px",
            marginLeft: isRTL ? "auto" : "0",
            marginRight: isRTL ? "0" : "auto",
        },
        "& .MuiInputLabel-shrink": {
            backgroundColor: "#ffffff",
            paddingLeft: isRTL ? "0px" : "4px",
            paddingRight: isRTL ? "4px" : "0px",
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={datePickerTheme}>
                <Box sx={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                    {/* PAGE TITLE */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "#1d4a6d",
                                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                                textAlign: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {t("page.companyRegistration")}
                        </Typography>
                    </Box>

                    {/* ALERT */}
                    {showAlert && (
                        <Box sx={{ mb: 3 }}>
                            <Alert 
                                severity="error" 
                                onClose={() => setShowAlert(false)}
                                sx={{
                                    direction: isRTL ? 'rtl' : 'ltr',
                                    textAlign: isRTL ? 'right' : 'left',
                                    display: "flex",
                                    flexDirection: isRTL ? "row-reverse" : "row",
                                    backgroundColor: "#ffebee",
                                    color: "#d39292ff",
                                    border: "1px solid #f5b3b3ff",
                                    borderRadius: "15px",
                                    boxShadow: "0 2px 8px rgba(189, 84, 84, 0.1)",
                                    "& .MuiAlert-message": {
                                         marginTop: "14px", 
                                        width: "75%",
                                        textAlign: isRTL ? "right" : "left",
                                        fontSize: "1.1rem",
                                        fontWeight: 550,
                                        justifyContent: isRTL ? "flex-end" : "flex-start",
                                        display: "flex",
                                        color: "#bd5555ff",
                                    },
                                    "& .MuiAlert-icon": {
                                        fontSize: "3rem",
                                        marginLeft: isRTL ? "12px" : "0px",
                                        marginRight: isRTL ? "0px" : "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#e77070ff",
                                    },
                                    "& .MuiAlert-action": {
                                        alignItems: "center",
                                        marginLeft: isRTL ? "0px" : "auto",
                                        marginRight: isRTL ? "auto" : "0px",
                                    }
                                }}
                            >
                                {t("validation.fillAllRequired")}
                            </Alert>
                        </Box>
                    )}

                    {/* COMPANY DETAILS CARD */}
                    <Card
                        sx={{
                            boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                            borderRadius: "16px",
                            mb: 2,
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: "#1d4a6d",
                                    mb: 2,
                                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                    textAlign: "left",
                                }}
                            >
                                {t("section.companyDetails")}
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: "#e8e8e8" }} />

                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ flex: '1 1 30%', minWidth: '150px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t("fields.crNumber")}
                                        value={formData.crNumber}
                                        onChange={(e) => {
                                            setFormData({ ...formData, crNumber: e.target.value });
                                        }}
                                        onBlur={(e) => handleBlur('crNumber', e.target.value)}
                                        error={errors.crNumber}
                                        helperText={errors.crNumber ? t("validation.fieldRequired") : ""}
                                        sx={textFieldSx}
                                        InputLabelProps={{
                                            sx: {
                                                '& .MuiInputLabel-asterisk': {
                                                    color: '#ef5350',
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 66%', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label={t("fields.companyName")}
                                        value={formData.companyName}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "12px",
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                height: "56px",
                                                "& fieldset": {
                                                    borderColor: "#e0e0e0",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                textAlign: isRTL ? 'right' : 'left',
                                                fontSize: "14px",
                                                padding: "16px 14px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                backgroundColor: "#f9f9f9",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* OCCI DETAILS CARD */}
                    <Card
                        sx={{
                            boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                            borderRadius: "16px",
                            mb: 2,
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: "#1d4a6d",
                                    mb: 2,
                                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                    textAlign: "left",
                                }}
                            >
                                {t("section.occiDetails")}
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: "#e8e8e8" }} />

                            <Grid container spacing={3}>
                                {/* OCCI Number */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={t("fields.occiNumber")}
                                        value={formData.occiNumber || ""}
                                        onChange={(e) => {
                                            setFormData({ ...formData, occiNumber: e.target.value });
                                        }}
                                        onBlur={(e) => handleBlur('occiNumber', e.target.value)}
                                        error={errors.occiNumber}
                                        helperText={errors.occiNumber ? t("validation.fieldRequired") : ""}
                                        sx={textFieldSx}
                                        InputLabelProps={{
                                            sx: {
                                                '& .MuiInputLabel-asterisk': {
                                                    color: '#ef5350',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* OCCI Expiry Date - FIXED WITH ROUNDED CORNERS */}
                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        label={t("fields.occiExpiryDate")}
                                        value={formData.occiExpiry || null}
                                        onChange={(newValue) => {
                                            setFormData({ ...formData, occiExpiry: newValue });
                                            handleBlur('occiExpiry', newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                variant: "outlined",
                                                error: errors.occiExpiry,
                                                helperText: errors.occiExpiry ? t("validation.fieldRequired") : "",
                                                onBlur: () => handleBlur('occiExpiry', formData.occiExpiry),
                                                sx: {
                                                    "& .MuiOutlinedInput-root": {
                                                        backgroundColor: "#ffffff",
                                                        borderRadius: "12px !important",
                                                        border: "1px solid #e0e0e0",
                                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                        transition: "all 0.3s ease",
                                                        height: "56px",
                                                        "& fieldset": {
                                                            borderColor: "#e0e0e0",
                                                            borderRadius: "12px",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#1d466dff",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#1d466dff",
                                                            boxShadow: "0 4px 12px rgba(29, 70, 109, 0.15)",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        textAlign: isRTL ? 'right' : 'left',
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        padding: "16px 14px",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        textAlign: isRTL ? 'right' : 'left',
                                                        transformOrigin: isRTL ? 'top right' : 'top left',
                                                        backgroundColor: "#ffffff",
                                                        paddingLeft: isRTL ? "0px" : "4px",
                                                        paddingRight: isRTL ? "4px" : "0px",
                                                        paddingTop: "0px",
                                                        marginLeft: isRTL ? "auto" : "0",
                                                        marginRight: isRTL ? "0" : "auto",
                                                    },
                                                    "& .MuiInputLabel-shrink": {
                                                        backgroundColor: "#ffffff",
                                                        paddingLeft: isRTL ? "0px" : "4px",
                                                        paddingRight: isRTL ? "4px" : "0px",
                                                    },
                                                },
                                                InputLabelProps: {
                                                    sx: {
                                                        '& .MuiInputLabel-asterisk': {
                                                            color: '#ef5350',
                                                        }
                                                    }
                                                },
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Years to Renew */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        select
                                        label={t("fields.yearsToRenew")}
                                        value={formData.yearsToRenew || ""}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                yearsToRenew: e.target.value,
                                            });
                                            handleBlur('yearsToRenew', e.target.value);
                                        }}
                                        onBlur={(e) => handleBlur('yearsToRenew', e.target.value)}
                                        error={errors.yearsToRenew}
                                        helperText={errors.yearsToRenew ? t("validation.fieldRequired") : ""}
                                        sx={{
                                            ...textFieldSx,
                                            minWidth: "200px",
                                            width: "100%",
                                            "& .MuiSelect-select": {
                                                textAlign: isRTL ? 'right' : 'left',
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: {
                                                transformOrigin: isRTL ? 'top right' : 'top left',
                                                '& .MuiInputLabel-asterisk': {
                                                    color: '#ef5350',
                                                },
                                                backgroundColor: "#ffffff",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            }
                                        }}
                                    >
                                        <MenuItem value={1}>{t("select.oneYear")}</MenuItem>
                                        <MenuItem value={2}>{t("select.twoYears")}</MenuItem>
                                    </TextField>
                                </Grid>

                                {/* Degree */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        select
                                        label={t("fields.degree")}
                                        value={formData.degree || ""}
                                        onChange={(e) => {
                                            setFormData({ ...formData, degree: e.target.value });
                                            handleBlur('degree', e.target.value);
                                        }}
                                        onBlur={(e) => handleBlur('degree', e.target.value)}
                                        error={errors.degree}
                                        helperText={errors.degree ? t("validation.fieldRequired") : ""}
                                        sx={{
                                            ...textFieldSx,
                                            minWidth: "200px",
                                            width: "100%",
                                            "& .MuiSelect-select": {
                                                textAlign: isRTL ? 'right' : 'left',
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: {
                                                transformOrigin: isRTL ? 'top right' : 'top left',
                                                '& .MuiInputLabel-asterisk': {
                                                    color: '#ef5350',
                                                },
                                                backgroundColor: "#ffffff",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            }
                                        }}
                                    >
                                        <MenuItem value="*">*</MenuItem>
                                        <MenuItem value="**">**</MenuItem>
                                        <MenuItem value="***">***</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* SME & RIYADA CARD */}
                    <Card
                        sx={{
                            boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                            borderRadius: "16px",
                            mb: 2,
                            border: "1px solid #f0f0f0",
                        }}
                    >
                        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: "#1d4a6d",
                                    mb: 2,
                                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                    textAlign: "left",
                                }}
                            >
                                {t("section.smeRiyadaDetails")}
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: "#e8e8e8" }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label={t("fields.isSme")}
                                        value={formData.isSme ? t("common.yes") : t("common.no")}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "12px",
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                height: "56px",
                                                "& fieldset": {
                                                    borderColor: "#e0e0e0",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                textAlign: isRTL ? 'right' : 'left',
                                                fontSize: "14px",
                                                padding: "16px 14px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                backgroundColor: "#f9f9f9",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label={t("fields.smeType")}
                                        value={formData.smeType || "-"}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "12px",
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                height: "56px",
                                                "& fieldset": {
                                                    borderColor: "#e0e0e0",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                textAlign: isRTL ? 'right' : 'left',
                                                fontSize: "14px",
                                                padding: "16px 14px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                backgroundColor: "#f9f9f9",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label={t("fields.isRiyadaRegistered")}
                                        value={formData.isRiyadaRegistered ? t("common.yes") : t("common.no")}
                                        InputProps={{ readOnly: true }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "12px",
                                                border: "1px solid #e0e0e0",
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                height: "56px",
                                                "& fieldset": {
                                                    borderColor: "#e0e0e0",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                textAlign: isRTL ? 'right' : 'left',
                                                fontSize: "14px",
                                                padding: "16px 14px",
                                            },
                                            "& .MuiInputLabel-root": {
                                                backgroundColor: "#f9f9f9",
                                                paddingLeft: isRTL ? "0px" : "4px",
                                                paddingRight: isRTL ? "4px" : "0px",
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Riyada Expiry Date - FIXED WITH ROUNDED CORNERS */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <DatePicker
                                        label={t("fields.riydaCardExpiry")}
                                        value={formData.riydaExpiry}
                                        onChange={(newVal) => {
                                            setFormData({ ...formData, riydaExpiry: newVal });
                                            handleBlur('riydaExpiry', newVal);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                                variant: "outlined",
                                                error: errors.riydaExpiry,
                                                helperText: errors.riydaExpiry ? t("validation.fieldRequired") : "",
                                                onBlur: () => handleBlur('riydaExpiry', formData.riydaExpiry),
                                                sx: {
                                                    "& .MuiOutlinedInput-root": {
                                                        backgroundColor: "#ffffff",
                                                        borderRadius: "12px !important",
                                                        border: "1px solid #e0e0e0",
                                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                                        transition: "all 0.3s ease",
                                                        height: "56px",
                                                        "& fieldset": {
                                                            borderColor: "#e0e0e0",
                                                            borderRadius: "12px",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: "#1d466dff",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: "#1d466dff",
                                                            boxShadow: "0 4px 12px rgba(29, 70, 109, 0.15)",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        textAlign: isRTL ? 'right' : 'left',
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        padding: "16px 14px",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        textAlign: isRTL ? 'right' : 'left',
                                                        transformOrigin: isRTL ? 'top right' : 'top left',
                                                        backgroundColor: "#ffffff",
                                                        paddingLeft: isRTL ? "0px" : "4px",
                                                        paddingRight: isRTL ? "4px" : "0px",
                                                        paddingTop: "0px",
                                                        marginLeft: isRTL ? "auto" : "0",
                                                        marginRight: isRTL ? "0" : "auto",
                                                    },
                                                    "& .MuiInputLabel-shrink": {
                                                        backgroundColor: "#ffffff",
                                                        paddingLeft: isRTL ? "0px" : "4px",
                                                        paddingRight: isRTL ? "4px" : "0px",
                                                    },
                                                },
                                                InputLabelProps: {
                                                    sx: {
                                                        '& .MuiInputLabel-asterisk': {
                                                            color: '#ef5350',
                                                        }
                                                    }
                                                },
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* NEXT BUTTON */}
                    <Box
                        sx={{
                            textAlign: "center",
                            mt: 4,
                            mb: { xs: 3, md: 4 },
                        }}
                    >
                       <Button
    variant="contained"
    size="large"
    sx={{
        px: 6,
        py: 1.8,
        borderRadius: "14px",
        background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "15px",
        textTransform: "none",
        boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.5)",
        },
    }}
    onClick={handleSearch}
>
    {t("buttons.next")} →
</Button>
                    </Box>
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
