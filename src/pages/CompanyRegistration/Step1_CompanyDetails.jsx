/*
 * Step1_CompanyDetails.jsx - COMPLETE RTL/LTR SUPPORT
 * 
 * RTL Features:
 * 1. Fields flow RIGHT to LEFT in Arabic
 * 2. Labels on RIGHT side in Arabic
 * 3. Values RIGHT-ALIGNED in Arabic
 * 4. Alerts start from RIGHT with icon on RIGHT
 * 5. Validation messages on RIGHT
 * 6. DatePicker compact, professional, RTL-aware
 * 7. All buttons/icons RTL-aware
 */

import React, { useState, useEffect } from "react";
import {
    TextField,
    Grid,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    MenuItem,
    Divider,
    Tooltip,
    CircularProgress,
    IconButton,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { validateCompany, checkExistingSR } from "../../api/companyApi";
import dayjs from 'dayjs';

const datePickerTheme = createTheme({
    palette: { primary: { main: "#1d4a6d" } },
});

const allowOnlyNumbers = (value, maxLen = 9) => {
    return value.replace(/[^0-9]/g, "").slice(0, maxLen);
};

export default function Step1_CompanyDetails({ formData, setFormData, next, setCrChecked, onExistingSRFound }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    const [checkingSR, setCheckingSR] = useState(false);
    const [existingSRInfo, setExistingSRInfo] = useState(null);

    // ═══════════════════════════════════════════════════════════════
    // RTL-AWARE TEXT FIELD STYLING
    // ═══════════════════════════════════════════════════════════════
    const getFieldSx = (hasError = false) => ({
        "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
            "& fieldset": { borderColor: hasError ? "#ef5350" : "#e0e0e0" },
            "&:hover fieldset": { borderColor: hasError ? "#ef5350" : "#bdbdbd" },
            "&.Mui-focused fieldset": { borderColor: "#1d4a6d", borderWidth: "1.5px" },
        },
        "& .MuiInputBase-input": {
            fontSize: "12px",
            padding: "8px 12px",
            textAlign: isRTL ? "right" : "left",
            direction: isRTL ? "rtl" : "ltr",
        },
        "& .MuiInputLabel-root": {
            right: isRTL ? 14 : "unset",
            left: isRTL ? "unset" : 14,
            transformOrigin: isRTL ? "top right" : "top left",
            "&.MuiInputLabel-shrink": {
                transform: isRTL 
                    ? "translate(-14px, -9px) scale(0.75)" 
                    : "translate(14px, -9px) scale(0.75)",
            },
            background: "#fff",
            padding: "0 4px",
            color: "#1d4a6d",
            fontSize: "12px",
            fontWeight: 700,
        },
        "& .MuiInputLabel-asterisk": { color: "#ef5350", fontWeight: "bold" },
        "& .MuiFormHelperText-root": {
            textAlign: isRTL ? "right" : "left",
            marginRight: isRTL ? "14px" : 0,
            marginLeft: isRTL ? 0 : "14px",
            direction: isRTL ? "rtl" : "ltr",
            fontSize: "11px",
        },
    });

    // ═══════════════════════════════════════════════════════════════
    // RTL-AWARE SELECT FIELD STYLING
    // ═══════════════════════════════════════════════════════════════
    const getSelectFieldSx = (hasError = false) => ({
        ...getFieldSx(hasError),
        "& .MuiSelect-select": {
            fontSize: "12px",
            padding: "8px 12px !important",
            textAlign: isRTL ? "right" : "left",
            paddingRight: isRTL ? "12px !important" : "32px !important",
            paddingLeft: isRTL ? "32px !important" : "12px !important",
        },
        "& .MuiSelect-icon": {
            right: isRTL ? "unset" : 7,
            left: isRTL ? 7 : "unset",
        },
    });

    // ═══════════════════════════════════════════════════════════════
    // PROFESSIONAL COMPACT DATEPICKER STYLING
    // ═══════════════════════════════════════════════════════════════
    const getDatePickerSx = (hasError = false) => ({
        width: { xs: "100%", sm: "160px" },
        minWidth: "140px",
        "& .MuiInputBase-root": {
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
            paddingRight: "8px",
            paddingLeft: "12px",
            "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: hasError ? "#ef5350" : "#bdbdbd",
                },
            },
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "12px",
            borderColor: hasError ? "#ef5350" : "#e0e0e0",
            borderWidth: "1px",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1d4a6d",
            borderWidth: "1.5px",
        },
        "& .MuiInputBase-input": {
            fontSize: "12px",
            padding: "8px 4px",
            textAlign: "center",
        },
        "& .MuiInputLabel-root": {
            right: isRTL ? 14 : "unset",
            left: isRTL ? "unset" : 14,
            transformOrigin: isRTL ? "top right" : "top left",
            "&.MuiInputLabel-shrink": {
                transform: isRTL 
                    ? "translate(-14px, -9px) scale(0.75)" 
                    : "translate(14px, -9px) scale(0.75)",
            },
            background: "#fff",
            padding: "0 4px",
            color: "#1d4a6d",
            fontSize: "12px",
            fontWeight: 700,
        },
        "& .MuiInputLabel-asterisk": { color: "#ef5350", fontWeight: "bold" },
        "& .MuiInputAdornment-root": {
            marginLeft: 0,
            marginRight: 0,
        },
        "& .MuiSvgIcon-root": {
            color: "#1d4a6d",
            fontSize: "20px",
        },
        "& .MuiFormHelperText-root": {
            textAlign: isRTL ? "right" : "left",
            direction: isRTL ? "rtl" : "ltr",
            fontSize: "11px",
            marginTop: "4px",
        },
    });
    

    // DatePicker Calendar Popper Styling
    const datePickerPopperSx = {
        "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
        },
        "& .MuiPickersLayout-root": {
            minWidth: { xs: "280px", sm: "300px" },
        },
        "& .MuiDateCalendar-root": {
            width: { xs: "280px", sm: "300px" },
            maxHeight: "320px",
        },
        "& .MuiPickersCalendarHeader-root": {
            padding: "12px 16px 8px",
            marginTop: 0,
            marginBottom: 0,
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e8e8e8",
        },
        "& .MuiPickersCalendarHeader-label": {
            fontSize: "14px",
            fontWeight: 600,
            color: "#1d4a6d",
        },
        "& .MuiPickersArrowSwitcher-button": {
            color: "#1d4a6d",
            "&:hover": {
                backgroundColor: "rgba(29, 74, 109, 0.08)",
            },
        },
        "& .MuiDayCalendar-header": {
            padding: "8px 12px 4px",
        },
        "& .MuiDayCalendar-weekDayLabel": {
            fontSize: "11px",
            width: "36px",
            height: "32px",
            color: "#1d4a6d",
            fontWeight: 600,
        },
        "& .MuiDayCalendar-weekContainer": {
            margin: "2px 0",
        },
        "& .MuiPickersDay-root": {
            fontSize: "13px",
            width: "36px",
            height: "36px",
            margin: "2px",
            borderRadius: "8px",
            "&:hover": {
                backgroundColor: "rgba(29, 74, 109, 0.08)",
            },
        },
        "& .MuiPickersDay-today": {
            border: "2px solid #1d4a6d !important",
            backgroundColor: "transparent",
            fontWeight: 600,
        },
        "& .MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#1d4a6d !important",
            color: "#fff !important",
            fontWeight: 600,
            "&:hover": {
                backgroundColor: "#153a54 !important",
            },
        },
        "& .MuiDayCalendar-slideTransition": {
            minHeight: "220px",
        },
        "& .MuiPickersYear-yearButton": {
            fontSize: "13px",
            borderRadius: "8px",
            "&.Mui-selected": {
                backgroundColor: "#1d4a6d !important",
            },
        },
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        if (formData.companyName && formData.degree && formData.crNumber && formData.occiNumber && formData.occiExpiry) {
            setIsValidatedSuccess(true);
            setApiValidation({ cr_match: true, occi_number_match: true, expiry_valid: true, isValidated: true });
            setErrors({ crNumber: false, occiNumber: false, occiExpiry: false, yearsToRenew: false, riydaExpiry: false });
            setShowAlert(false);
            setAlertMessage("");
        }
    }, []);

    const isApiValidationPassed = () => {
        return apiValidation.isValidated && apiValidation.cr_match === true && apiValidation.occi_number_match === true && apiValidation.expiry_valid === true;
    };

    const [isValidatedSuccess, setIsValidatedSuccess] = useState(() => !!(formData.companyName && formData.degree));
    const [errors, setErrors] = useState({ crNumber: false, occiNumber: false, occiExpiry: false, yearsToRenew: false, riydaExpiry: false });
    const [showAlert, setShowAlert] = useState(false);
    const [apiValidation, setApiValidation] = useState({ cr_match: null, occi_number_match: null, expiry_valid: null, isValidated: false });
    const [isValidating, setIsValidating] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const canValidate = !!formData.crNumber && !!formData.occiNumber && !!formData.occiExpiry && !isValidating && !isApiValidationPassed();

    // ═══════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════
    const handleResetCompany = () => {
        setFormData({ crNumber: "", occiNumber: "", occiExpiry: null, companyName: "", yearsToRenew: "", degree: "", isSme: false, smeType: "", isRiyadaRegistered: false, riydaExpiry: null });
        setErrors({ crNumber: false, occiNumber: false, occiExpiry: false, yearsToRenew: false, riydaExpiry: false });
        setApiValidation({ occi_number_match: null, expiry_valid: null, isValidated: false });
        setIsValidatedSuccess(false);
        setShowAlert(false);
        setAlertMessage("");
        setExistingSRInfo(null);
    };

    const handleValidateClick = async () => {
        const hasError = !formData.crNumber || !formData.occiNumber || !formData.occiExpiry;
        setErrors(prev => ({ ...prev, crNumber: !formData.crNumber, occiNumber: !formData.occiNumber, occiExpiry: !formData.occiExpiry }));

        if (hasError) {
            setAlertMessage(t("validation.pleaseValidateFirst"));
            setShowAlert(true);
            return;
        }

        setIsValidating(true);
        setShowAlert(false);

        try {
            const payload = { crNumber: formData.crNumber, occiNumber: formData.occiNumber, expiry: dayjs(formData.occiExpiry).format("DD-MM-YYYY") };
            const response = await validateCompany(payload);

            if (!response.data?.data) {
                const status = response.data?.status;
                if (status?.message?.toLowerCase().includes("occi returned null")) {
                    setErrors(prev => ({ ...prev, crNumber: true }));
                    setApiValidation({ cr_match: false, occi_number_match: null, expiry_valid: null, isValidated: true });
                    setAlertMessage(t("validation.invalidCrNumber"));
                    setShowAlert(true);
                    setIsValidatedSuccess(false);
                    return;
                }
                setAlertMessage(t("validation.apiError"));
                setShowAlert(true);
                setIsValidatedSuccess(false);
                return;
            }

            const out = response.data.data;
            const crMatch = out.cr_match === true || out.cr_match === "true";
            const occiMatch = out.occi_number_match === true || out.occi_number_match === "true";
            const expiryValid = out.expiry_valid === true || out.expiry_valid === "true";
            const isSuccess = crMatch && occiMatch && expiryValid;

            setErrors(prev => ({ ...prev, occiNumber: !occiMatch, occiExpiry: !expiryValid }));
            setApiValidation({ cr_match: crMatch, occi_number_match: occiMatch, expiry_valid: expiryValid, isValidated: true });

            if (isSuccess) setIsValidatedSuccess(true);

            if (!occiMatch || !expiryValid) {
                setAlertMessage([!crMatch && t("validation.invalidCrNumber"), !occiMatch && t("validation.invalidOcciNumber"), !expiryValid && t("validation.invalidOcciExpiry")].filter(Boolean).join(" | "));
                setShowAlert(true);
                setIsValidatedSuccess(false);
                return;
            }

            const companyName = i18n.language === "ar" ? out.name_ar : (out.name_en || out.name_ar);
            setFormData(prev => ({
                ...prev,
                companyName: companyName || "",
                degree: out.grade_desc_en || "",
                isSme: out.is_sme_registered === true || out.is_sme_registered === "true",
                smeType: out.is_sme_registered === true || out.is_sme_registered === "true" ? out.sme_type_name || "" : "-",
                isRiyadaRegistered: out.is_riyada_card === true || out.is_riyada_card === "true",
                riydaExpiry: out.riyada_card_expiry ? dayjs(out.riyada_card_expiry) : null,
            }));

            setCheckingSR(true);
            try {
                const srResponse = await checkExistingSR(formData.crNumber);
                if (srResponse.data?.hasActiveSR) {
                    setExistingSRInfo({ hasActiveSR: true, incidentId: srResponse.data.incidentId, incidentNumber: srResponse.data.incidentNumber });
                    setAlertMessage(t("validation.existingSRFound"));
                    setShowAlert(true);
                } else {
                    setExistingSRInfo(null);
                }
            } catch (srError) {
                setExistingSRInfo(null);
            } finally {
                setCheckingSR(false);
            }

        } catch (err) {
            setAlertMessage(t("validation.apiError"));
            setShowAlert(true);
            setApiValidation({ occi_number_match: null, expiry_valid: null, isValidated: false });
        } finally {
            setIsValidating(false);
        }
    };

    const resetApiValidation = () => {
        setApiValidation({ occi_number_match: null, expiry_valid: null, isValidated: false });
        setExistingSRInfo(null);
    };

    const handleViewExistingSR = () => { if (existingSRInfo && onExistingSRFound) onExistingSRFound(existingSRInfo); };

    const handleBlur = (fieldName, value) => {
        setErrors({ ...errors, [fieldName]: !value || (typeof value === 'string' && value.trim() === "") });
    };

    const validateAllFields = () => {
        const newErrors = {
            crNumber: !formData.crNumber || formData.crNumber.trim() === "",
            occiNumber: !formData.occiNumber || formData.occiNumber.trim() === "",
            occiExpiry: !formData.occiExpiry,
            yearsToRenew: !existingSRInfo?.hasActiveSR && isValidatedSuccess && !formData.yearsToRenew,
            riydaExpiry: !existingSRInfo?.hasActiveSR && formData.isRiyadaRegistered === true && !formData.riydaExpiry
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSearch = () => {
        if (existingSRInfo?.hasActiveSR) { setAlertMessage(t("validation.existingSRFound")); setShowAlert(true); return; }
        if (!validateAllFields()) { setAlertMessage(t("validation.fillAllRequired")); setShowAlert(true); return; }
        if (!apiValidation.isValidated) { setAlertMessage(t("validation.pleaseValidateFirst")); setShowAlert(true); return; }
        if (!isApiValidationPassed()) {
            const errorMessages = [];
            if (!apiValidation.occi_number_match) errorMessages.push(t("validation.invalidOcciNumber"));
            if (!apiValidation.expiry_valid) errorMessages.push(t("validation.invalidOcciExpiry"));
            setAlertMessage(errorMessages.join(" | "));
            setShowAlert(true);
            return;
        }
        setShowAlert(false);
        next();
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={datePickerTheme}>
                {/* MAIN CONTAINER - RTL/LTR Direction */}
                <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
                    
                    {/* ═══════════════════════════════════════════════════════════════
                        PAGE TITLE
                    ═══════════════════════════════════════════════════════════════ */}
                    <Box sx={{ 
                        width: "100%", 
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "center", 
                        mt: 0.5, 
                        mb: 1 
                    }}>
                        <Typography sx={{ 
                            fontWeight: 600, 
                            color: "#1d4a6d", 
                            fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" }, 
                            textAlign: "center",
                            mb: 0.5 
                        }}>
                            {t("page.companyRegistration")}
                        </Typography>

                        {/* INFO BAR */}
                        <Box sx={{ 
                            background: "#ffffff", 
                            border: "1px solid #e5e7eb", 
                            borderRadius: "10px", 
                            padding: "8px 16px", 
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5,
                        }}>
                            <Box sx={{ 
                                backgroundColor: "#1d4a6d", 
                                borderRadius: "6px", 
                                width: 26, 
                                height: 26, 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                flexShrink: 0 
                            }}>
                                <InfoIcon sx={{ color: "#ffffff", fontSize: 16 }} />
                            </Box>
                            <Typography sx={{ 
                                color: "#b91c1c", 
                                fontSize: { xs: "12px", sm: "13px" }, 
                                fontWeight: 600,
                                lineHeight: 1.4,
                            }}>
                                {t("announcement.baladiyetiMessage")}
                            </Typography>
                        </Box>
                    </Box>

                    {/* ═══════════════════════════════════════════════════════════════
                        CUSTOM RTL-AWARE ALERT
                    ═══════════════════════════════════════════════════════════════ */}
                    {showAlert && (
                        <Box sx={{ mb: 1.5 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    py: 1.25,
                                    px: 2,
                                    borderRadius: "12px",
                                    backgroundColor: existingSRInfo?.hasActiveSR ? "#e8f4fd" : "#fef3cd",
                                    border: `1px solid ${existingSRInfo?.hasActiveSR ? "#7a8da8ff" : "#ffc107"}`,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                }}
                            >
                                {/* Icon */}
                                <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                                    {existingSRInfo?.hasActiveSR ? (
                                        <InfoOutlinedIcon sx={{ color: "#345381ff", fontSize: 22 }} />
                                    ) : (
                                        <WarningAmberIcon sx={{ color: "#856404", fontSize: 22 }} />
                                    )}
                                </Box>
                                
                                {/* Message */}
                                <Typography
                                    sx={{
                                        flex: 1,
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        color: existingSRInfo?.hasActiveSR ? "#345381ff" : "#856404",
                                        textAlign: isRTL ? "right" : "left",
                                    }}
                                >
                                    {alertMessage || t("validation.fillAllRequired")}
                                </Typography>
                                
                                {/* Close Button */}
                                <IconButton
                                    size="small"
                                    onClick={() => setShowAlert(false)}
                                    sx={{
                                        flexShrink: 0,
                                        padding: "4px",
                                        color: existingSRInfo?.hasActiveSR ? "#345381ff" : "#856404",
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0.08)",
                                        },
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                        COMPANY DETAILS CARD
                    ═══════════════════════════════════════════════════════════════ */}
                    <Card sx={{ 
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)", 
                        borderRadius: "16px", 
                        mb: 1.5, 
                        border: "1px solid #f0f0f0" 
                    }}>
                        <CardContent sx={{ 
                            pt: 2, 
                            px: { xs: 2, sm: 2.5, md: 3 }, 
                            pb: 2,
                            "&:last-child": { pb: 2 }
                        }}>
                            
                            {/* Section Title */}
                            <Typography sx={{ 
                                fontWeight: 600, 
                                color: "#1d4a6d", 
                                mb: 1, 
                                fontSize: "16px", 
                                textAlign: isRTL ? "right" : "left" 
                            }}>
                                {t("section.companyDetails")}
                            </Typography>

                            <Divider sx={{ mb: 2.5, backgroundColor: "#e8e8e8" }} />

                            {/* ═══════════════════════════════════════════════════════════════
                                ROW 1: MAIN FIELDS
                            ═══════════════════════════════════════════════════════════════ */}
                            <Box sx={{ 
                                display: "flex", 
                                gap: { xs: 2, sm: 2.5 }, 
                                flexWrap: "wrap", 
                                mb: 2 
                            }}>
                                
                                {/* CR Number */}
                                <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                                    <TextField
                                        fullWidth
                                        required
                                        disabled={isValidatedSuccess}
                                        label={t("fields.crNumber")}
                                        value={formData.crNumber}
                                        inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*", style: { direction: "ltr", textAlign: isRTL ? "right" : "left" } }}
                                        onChange={(e) => { setFormData(prev => ({ ...prev, crNumber: allowOnlyNumbers(e.target.value, 9) })); resetApiValidation(); setIsValidatedSuccess(false); setCrChecked(false); }}
                                        onBlur={(e) => handleBlur("crNumber", e.target.value)}
                                        error={errors.crNumber || (apiValidation.isValidated && apiValidation.cr_match === false)}
                                        helperText={errors.crNumber ? t("validation.fieldRequired") : apiValidation.isValidated && apiValidation.cr_match === false ? t("validation.invalidCrNumber") : ""}
                                        InputLabelProps={{ shrink: true }}
                                        sx={getFieldSx(errors.crNumber || (apiValidation.isValidated && apiValidation.cr_match === false))}
                                    />
                                </Box>

                                {/* OCCI Number */}
                                <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                                    <TextField
                                        fullWidth
                                        required
                                        disabled={isValidatedSuccess}
                                        label={t("fields.occiNumber")}
                                        value={formData.occiNumber || ""}
                                        inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*", style: { direction: "ltr", textAlign: isRTL ? "right" : "left" } }}
                                        onChange={(e) => { setFormData({ ...formData, occiNumber: allowOnlyNumbers(e.target.value, 9) }); resetApiValidation(); setIsValidatedSuccess(false); }}
                                        onBlur={(e) => handleBlur("occiNumber", e.target.value)}
                                        error={errors.occiNumber || (apiValidation.isValidated && apiValidation.occi_number_match === false)}
                                        helperText={errors.occiNumber ? t("validation.fieldRequired") : apiValidation.isValidated && apiValidation.occi_number_match === false ? t("validation.invalidOcciNumber") : ""}
                                        InputLabelProps={{ shrink: true }}
                                        sx={getFieldSx(errors.occiNumber || (apiValidation.isValidated && apiValidation.occi_number_match === false))}
                                    />
                                </Box>

                                {/* OCCI Expiry Date */}
                                <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 160px" } }}>

                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        label={t("fields.occiExpiryDate")}
                                        value={formData.occiExpiry || null}
                                        disabled={isValidatedSuccess}
                                        onChange={(newValue) => {
                                            setFormData({ ...formData, occiExpiry: newValue });
                                            resetApiValidation();
                                            setIsValidatedSuccess(false);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: false,
                                                required: true,
                                                size: "small",
                                                error:
                                                    errors.occiExpiry ||
                                                    (apiValidation.isValidated && apiValidation.expiry_valid === false),
                                                helperText: errors.occiExpiry
                                                    ? t("validation.fieldRequired")
                                                    : apiValidation.isValidated && apiValidation.expiry_valid === false
                                                        ? t("validation.invalidOcciExpiry")
                                                        : "",
                                                InputLabelProps: { shrink: true },
                                                inputProps: {
                                                    style: {
                                                        fontSize: "11px",      // ✅ VALUE SIZE (MM/DD/YYYY)
                                                        padding: "4px 6px",
                                                        lineHeight: "1.2",
                                                    },
                                                },
                                                sx: {
                                                    width: "160px",
                                                    minWidth: "140px",
                                                    "& .MuiInputBase-root": {
                                                        height: "32px",
                                                        borderRadius: "12px",
                                                        backgroundColor: "#f9f9f9",
                                                    },
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderRadius: "12px !important",
                                                        borderColor: "#e0e0e0",
                                                        borderWidth: "1px",
                                                    },
                                                    "& fieldset": {
                                                        borderRadius: "12px !important",
                                                    },
                                                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#e0e0e0",
                                                        borderWidth: "1px",
                                                    },
                                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#1d4a6d",
                                                        borderWidth: "1px",
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        fontSize: "5px",
                                                        padding: "4px 6px",
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        transform: "translate(12px, -7px) scale(0.8)",
                                                        background: "#fff",
                                                        padding: "0 3px",
                                                        color: "#1d4a6d",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                    },
                                                    "& .MuiInputLabel-asterisk": {
                                                        color: "#ef5350",
                                                        fontWeight: "bold",
                                                    },
                                                    "& .MuiSvgIcon-root": {
                                                        color: "#1d4a6d !important",
                                                        fontSize: "14px",
                                                    },
                                                    "& .MuiInputAdornment-root": {
                                                        marginRight: "2px",
                                                    },
                                                },
                                            },
                                            popper: {
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        borderRadius: "10px",
                                                        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                                                    },
                                                    "& .MuiPickersLayout-root": {
                                                        minWidth: "200px !important",
                                                    },
                                                    "& .MuiDateCalendar-root": {
                                                        width: "200px",
                                                        height: "auto",
                                                    },
                                                    "& .MuiPickersCalendarHeader-root": {
                                                        padding: "4px 8px",
                                                        minHeight: "28px",
                                                        marginTop: "4px",
                                                        marginBottom: "0px",
                                                    },
                                                    "& .MuiPickersCalendarHeader-label": {
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                    },
                                                    "& .MuiPickersArrowSwitcher-button": {
                                                        padding: "2px",
                                                    },
                                                    "& .MuiPickersArrowSwitcher-button svg": {
                                                        fontSize: "14px",
                                                    },
                                                    "& .MuiDayCalendar-header": {
                                                        gap: "0px",
                                                        padding: "0 4px",
                                                    },
                                                    "& .MuiDayCalendar-weekDayLabel": {
                                                        fontSize: "9px",
                                                        width: "24px",
                                                        height: "20px",
                                                        margin: "0px",
                                                    },
                                                    "& .MuiDayCalendar-weekContainer": {
                                                        margin: "0px",
                                                    },
                                                    "& .MuiPickersDay-root": {
                                                        fontSize: "10px",
                                                        width: "24px",
                                                        height: "24px",
                                                        margin: "0px",
                                                    },
                                                    "& .MuiDayCalendar-slideTransition": {
                                                        minHeight: "150px",
                                                    },
                                                    "& .MuiPickersDay-today": {
                                                        border: "1px solid #1d4a6d !important",
                                                    },
                                                    "& .MuiPickersDay-root.Mui-selected": {
                                                        backgroundColor: "#1d4a6d !important",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                </Box>
                                

                                {/* Company Name */}
                                <Box sx={{ flex: "0 0 300px", maxWidth: "300px" }}>
                                    <TextField
                                        fullWidth
                                        label={t("fields.companyName")}
                                        value={formData.companyName}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={getFieldSx(false)}
                                    />
                                </Box>
                                    {/* Validate Button */}
                                 <Box sx={{ flex: "0 0 120px", maxWidth: "120px" }}>
                                    <Tooltip
                                        title={
                                            isApiValidationPassed()
                                                ? t("buttons.validated", "Validated")
                                                : t("buttons.validate", "Click to Validate")
                                        }
                                        arrow
                                    >
                                        <span>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleValidateClick}
                                                disabled={!canValidate}
startIcon={
                                                    isValidating || checkingSR ? (
                                                        <CircularProgress size={14} sx={{ color: "#fff" }} />
                                                    ) : isApiValidationPassed() ? (
                                                        <CheckCircleIcon sx={{ fontSize: "16px !important" }} />
                                                    ) : (
                                                        <VerifiedIcon sx={{ fontSize: "16px !important" }} />
                                                    )
                                                }
                                                sx={{
                                                    height: "40px",
                                                    minWidth: "auto",
                                                    px: 2,
                                                    borderRadius: "12px",
                                                    background: isApiValidationPassed()
                                                        ? "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)"
                                                        : "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                                                    color: "#fff",
                                                    fontWeight: 400,
                                                    fontSize: "10px",
                                                    textTransform: "none",
                                                    boxShadow: isApiValidationPassed()
                                                        ? "0 2px 8px rgba(46, 125, 50, 0.3)"
                                                        : "0 2px 8px rgba(29, 70, 109, 0.3)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        transform: "translateY(-1px)",
                                                        boxShadow: isApiValidationPassed()
                                                            ? "0 4px 12px rgba(46, 125, 50, 0.4)"
                                                            : "0 4px 12px rgba(29, 70, 109, 0.4)",
                                                    },
                                                    "&:disabled": {
                                                        background: "#b0bec5",
                                                        color: "#fff",
                                                    },
                                                    "& .MuiButton-startIcon": {
                                                        marginRight: "6px",
                                                    },
                                                }}
                                            >
                                              {isValidating || checkingSR
                                                    ? t("validation.validating", "...")
                                                    : isApiValidationPassed()
                                                        ? t("buttons.validated", "Validated")
                                                        : t("buttons.validate", "Validate")}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Box>

                                {/* Years to Renew */}
                                {!existingSRInfo?.hasActiveSR && (
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 160px" } }}>
                                        <TextField
                                            fullWidth
                                            required={isValidatedSuccess}
                                            disabled={!isValidatedSuccess}
                                            select
                                            label={t("fields.yearsToRenew")}
                                            value={formData.yearsToRenew || ""}
                                            onChange={(e) => { setFormData({ ...formData, yearsToRenew: e.target.value }); handleBlur("yearsToRenew", e.target.value); }}
                                            onBlur={(e) => handleBlur("yearsToRenew", e.target.value)}
                                            error={errors.yearsToRenew}
                                            helperText={errors.yearsToRenew ? t("validation.fieldRequired") : ""}
                                            InputLabelProps={{ shrink: true }}
                                            sx={getSelectFieldSx(errors.yearsToRenew)}
                                            SelectProps={{
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: {
                                                            borderRadius: "10px",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                                            "& .MuiMenuItem-root": {
                                                                fontSize: "12px",
                                                                textAlign: isRTL ? "right" : "left",
                                                                justifyContent: isRTL ? "flex-end" : "flex-start",
                                                                direction: isRTL ? "rtl" : "ltr",
                                                                padding: "10px 16px",
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value={1}>{t("select.oneYear")}</MenuItem>
                                            <MenuItem value={2}>{t("select.twoYears")}</MenuItem>
                                        </TextField>
                                    </Box>
                                )}

                                       {/* ═══════════════════════════════════════════════════════════════
                                ROW 2: DEGREE + VALIDATE
                            ═══════════════════════════════════════════════════════════════ */}
                            <Box sx={{ 
                                display: "flex", 
                                gap: { xs: 2, sm: 2.5 }, 
                                flexWrap: "wrap", 
                                alignItems: "flex-start" 
                            }}>
                                
                                {/* Degree */}
                                {!existingSRInfo?.hasActiveSR && (
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                                        <TextField
                                            fullWidth
                                            label={t("fields.degree")}
                                            value={formData.degree || ""}
                                            InputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={getFieldSx(false)}
                                        />
                                    </Box>
                                )}

                            
                            </Box>
                            </Box>

                     
                        </CardContent>
                    </Card>

                    {/* ═══════════════════════════════════════════════════════════════
                        SME & RIYADHA DETAILS CARD
                    ═══════════════════════════════════════════════════════════════ */}
                    {!existingSRInfo?.hasActiveSR && (
                        <Card sx={{ 
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)", 
                            borderRadius: "16px", 
                            mb: 1.5, 
                            border: "1px solid #f0f0f0" 
                        }}>
                            <CardContent sx={{ 
                                pt: 2, 
                                px: { xs: 2, sm: 2.5, md: 3 }, 
                                pb: 2,
                                "&:last-child": { pb: 2 }
                            }}>
                                
                                {/* Section Title */}
                                <Typography sx={{ 
                                    fontWeight: 600, 
                                    color: "#1d4a6d", 
                                    mb: 1, 
                                    fontSize: "16px", 
                                    textAlign: isRTL ? "right" : "left" 
                                }}>
                                    {t("section.smeRiyadaDetails")}
                                </Typography>

                                <Divider sx={{ mb: 2.5, backgroundColor: "#e8e8e8" }} />

                                {/* SME Fields */}
                                <Box sx={{ 
                                    display: "flex", 
                                    gap: { xs: 2, sm: 2.5 }, 
                                    flexWrap: "wrap" 
                                }}>
                                    
                                    {/* Is SME */}
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 180px" } }}>
                                        <TextField
                                            fullWidth
                                            label={t("fields.isSme")}
                                            value={formData.isSme ? t("common.yes") : t("common.no")}
                                            InputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={getFieldSx(false)}
                                        />
                                    </Box>

                                    {/* SME Type */}
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                                        <TextField
                                            fullWidth
                                            label={t("fields.smeType")}
                                            value={formData.smeType || "-"}
                                            InputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={getFieldSx(false)}
                                        />
                                    </Box>

                                    {/* Is Riyada Registered */}
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 180px" } }}>
                                        <TextField
                                            fullWidth
                                            label={t("fields.isRiyadaRegistered")}
                                            value={formData.isRiyadaRegistered ? t("common.yes") : t("common.no")}
                                            InputProps={{ readOnly: true }}
                                            InputLabelProps={{ shrink: true }}
                                            sx={getFieldSx(false)}
                                        />
                                    </Box>

                                    {/* Riyada Card Expiry */}
                                    <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 160px" } }}>
                                     	
								    {/* RIYADA CARD EXPIRY DATE */}
                                <Grid item xs={12} md={6}>
                                    <DatePicker
                                        label={t("fields.riydaCardExpiry")}
                                        value={formData.riydaExpiry || null}
                                        readOnly
                                        onChange={(newValue) => {
                                            setFormData({ ...formData, riydaExpiry: newValue });
                                            handleBlur("riydaExpiry", newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: false,
                                                required: false,
                                                size: "small",
                                                InputLabelProps: { shrink: true },

                                                /* ✅ VALUE TEXT (MM/DD/YYYY) */
                                                inputProps: {
                                                    style: {
                                                        fontSize: "11px",
                                                        padding: "4px 6px",
                                                        lineHeight: "1.2",
                                                    },
                                                },

                                                sx: {
                                                    width: "160px",
                                                    minWidth: "140px",

                                                    "& .MuiInputBase-root": {
                                                        height: "32px",
                                                        borderRadius: "12px",
                                                        backgroundColor: "#f9f9f9",
                                                    },

                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderRadius: "12px !important",
                                                        borderColor: "#e0e0e0",
                                                        borderWidth: "1px",
                                                    },

                                                    "& fieldset": {
                                                        borderRadius: "12px !important",
                                                    },

                                                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#e0e0e0",
                                                        borderWidth: "1px",
                                                    },

                                                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: "#1d4a6d",
                                                        borderWidth: "1px",
                                                    },

                                                    /* 🔽 FORCE VALUE SIZE (IMPORTANT) */
                                                    "& .MuiInputBase-input": {
                                                        fontSize: "11px",
                                                        padding: "4px 6px",
                                                    },

                                                    /* 🔼 LABEL */
                                                    "& .MuiInputLabel-root": {
                                                        transform: "translate(12px, -7px) scale(0.8)",
                                                        background: "#fff",
                                                        padding: "0 3px",
                                                        color: "#1d4a6d",
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                    },

                                                    "& .MuiInputLabel-asterisk": {
                                                        color: "#ef5350",
                                                        fontWeight: "bold",
                                                    },

                                                    "& .MuiSvgIcon-root": {
                                                        color: "#1d4a6d !important",
                                                        fontSize: "14px",
                                                    },

                                                    "& .MuiInputAdornment-root": {
                                                        marginRight: "2px",
                                                    },
                                                },
                                            },

                                            /* 📅 CALENDAR POPUP — SAME AS OCCI */
                                            popper: {
                                                sx: {
                                                    "& .MuiPaper-root": {
                                                        borderRadius: "10px",
                                                        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                                                    },
                                                    "& .MuiPickersLayout-root": {
                                                        minWidth: "200px !important",
                                                    },
                                                    "& .MuiDateCalendar-root": {
                                                        width: "200px",
                                                        height: "auto",
                                                    },
                                                    "& .MuiPickersCalendarHeader-root": {
                                                        padding: "4px 8px",
                                                        minHeight: "28px",
                                                        marginTop: "4px",
                                                        marginBottom: "0px",
                                                    },
                                                    "& .MuiPickersCalendarHeader-label": {
                                                        fontSize: "11px",
                                                        fontWeight: 600,
                                                    },
                                                    "& .MuiPickersArrowSwitcher-button": {
                                                        padding: "2px",
                                                    },
                                                    "& .MuiPickersArrowSwitcher-button svg": {
                                                        fontSize: "14px",
                                                    },
                                                    "& .MuiDayCalendar-weekDayLabel": {
                                                        fontSize: "9px",
                                                        width: "24px",
                                                        height: "20px",
                                                        margin: "0px",
                                                    },
                                                    "& .MuiPickersDay-root": {
                                                        fontSize: "10px",
                                                        width: "24px",
                                                        height: "24px",
                                                        margin: "0px",
                                                    },
                                                    "& .MuiPickersDay-root.Mui-selected": {
                                                        backgroundColor: "#1d4a6d !important",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                        ACTION BUTTONS
                    ═══════════════════════════════════════════════════════════════ */}
                    <Box sx={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        gap: 2, 
                        mt: 2.5, 
                        mb: 1 
                    }}>
                        
                        {/* Reset Button */}
                        {isValidatedSuccess && (
                            <Button
                                variant="outlined"
                                disabled={isValidating}
                                onClick={handleResetCompany}
                          sx={{
                                    height: "40px",
                                    minWidth: "auto",
                                    px: 2,
                                    borderRadius: "12px",
                                    fontWeight: 400,
                                    fontSize: "10px",
                                    textTransform: "none",
                                    background: isValidatedSuccess
                                        ? "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)"
                                        : "#b0bec5",
                                    color: "#fff",
                                    boxShadow: isValidatedSuccess
                                        ? "0 2px 8px rgba(29, 70, 109, 0.3)"
                                        : "none",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: isValidatedSuccess
                                            ? "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)"
                                            : "#b0bec5",
                                        transform: isValidatedSuccess ? "translateY(-1px)" : "none",
                                        boxShadow: isValidatedSuccess
                                            ? "0 4px 12px rgba(29, 70, 109, 0.4)"
                                            : "none",
                                    },
                                    "&:disabled": {
                                        background: "#b0bec5",
                                        color: "#fff",
                                    },
                                    "& .MuiButton-endIcon": {
                                        marginLeft: "6px",
                                    },
                                }}
                            >
                                <RestartAltIcon sx={{ fontSize: 18 }} />
                                <span>{t("buttons.reset")}</span>
                            </Button>
                        )}

                        {/* View Existing SR Button */}
                        {existingSRInfo?.hasActiveSR && (
                            <Button
                                variant="contained"
                                onClick={handleViewExistingSR}
                    sx={{
                                    height: "40px",
                                    minWidth: "auto",
                                    px: 2,
                                    borderRadius: "12px",
                                    fontWeight: 400,
                                    fontSize: "10px",
                                    textTransform: "none",
                                    background: isValidatedSuccess
                                        ? "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)"
                                        : "#b0bec5",
                                    color: "#fff",
                                    boxShadow: isValidatedSuccess
                                        ? "0 2px 8px rgba(29, 70, 109, 0.3)"
                                        : "none",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: isValidatedSuccess
                                            ? "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)"
                                            : "#b0bec5",
                                        transform: isValidatedSuccess ? "translateY(-1px)" : "none",
                                        boxShadow: isValidatedSuccess
                                            ? "0 4px 12px rgba(29, 70, 109, 0.4)"
                                            : "none",
                                    },
                                    "&:disabled": {
                                        background: "#b0bec5",
                                        color: "#fff",
                                    },
                                    "& .MuiButton-endIcon": {
                                        marginLeft: "6px",
                                    },
                                }}
                            >
                                {isRTL ? <ArrowBackIcon sx={{ fontSize: 18 }} /> : null}
                                <span>{t("buttons.viewSR")}</span>
                                {!isRTL ? <ArrowForwardIcon sx={{ fontSize: 18 }} /> : null}
                            </Button>
                        )}

                        {/* Next Button */}
                        {!existingSRInfo?.hasActiveSR && (
                            <Button
                                variant="contained"
                                disabled={!isValidatedSuccess}
                                onClick={handleSearch}
                             sx={{
                                    height: "40px",
                                    minWidth: "auto",
                                    px: 2,
                                    borderRadius: "12px",
                                    fontWeight: 400,
                                    fontSize: "10px",
                                    textTransform: "none",
                                    background: isValidatedSuccess
                                        ? "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)"
                                        : "#b0bec5",
                                    color: "#fff",
                                    boxShadow: isValidatedSuccess
                                        ? "0 2px 8px rgba(29, 70, 109, 0.3)"
                                        : "none",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: isValidatedSuccess
                                            ? "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)"
                                            : "#b0bec5",
                                        transform: isValidatedSuccess ? "translateY(-1px)" : "none",
                                        boxShadow: isValidatedSuccess
                                            ? "0 4px 12px rgba(29, 70, 109, 0.4)"
                                            : "none",
                                    },
                                    "&:disabled": {
                                        background: "#b0bec5",
                                        color: "#fff",
                                    },
                                    "& .MuiButton-endIcon": {
                                        marginLeft: "6px",
                                    },
                                }}
                            >
                                {isRTL ? <ArrowBackIcon sx={{ fontSize: 18 }} /> : null}
                                <span>{t("buttons.next")}</span>
                                {!isRTL ? <ArrowForwardIcon sx={{ fontSize: 18 }} /> : null}
                            </Button>
                        )}
                    </Box>
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
