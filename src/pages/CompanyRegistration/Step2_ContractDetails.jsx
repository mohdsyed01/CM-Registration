/* UPDATED: Bank list now fetched from database */

import React, { useState, useEffect } from "react";

import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Alert,
    MenuItem,
    CircularProgress,
} from "@mui/material";

import { useTranslation } from "react-i18next";

// Date picker imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// THEME (same color as Step1)
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getCompanyByCr } from "../../api/companyApi";
import { getBankList } from "../../api/lookupApi";  // ← NEW IMPORT


const theme = createTheme({
    palette: {
        primary: { main: "#1d466dff" },
    },
});

export default function Step2_ContractDetails({
    formData,
    setFormData,
    next,
    back,
}) {
    const [srDetails, setSrDetails] = useState(null);
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";
    const onlyNumbers = (value, maxLength) =>
        value.replace(/\D/g, "").slice(0, maxLength);

    const maxLengthAny = (value, maxLength) =>
        value.slice(0, maxLength);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const [crChecked, setCrChecked] = useState(false);
    const [crMessage, setCrMessage] = useState("");
    const [crMessageType, setCrMessageType] = useState("info"); // info | warning

    // ═══════════════════════════════════════════════════════════════════════════
    // BANK LIST - FROM DATABASE WITH FALLBACK
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Fallback bank list (same as OLD system)
    const FALLBACK_BANK_LIST = [
        { bankCode: "51", bankNameEng: "NATIONAL BANK OF OMAN", bankNameArb: "البنك الوطني العماني" },
        { bankCode: "52", bankNameEng: "HSBC Bank Middle East Limited", bankNameArb: "بنك HSBC الشرق الأوسط" },
        { bankCode: "53", bankNameEng: "CITIBANK", bankNameArb: "سيتي بنك" },
        { bankCode: "54", bankNameEng: "MUSCAT AHLI BANK", bankNameArb: "بنك مسقط الأهلي" },
        { bankCode: "55", bankNameEng: "OMAN ARAB BANK", bankNameArb: "بنك عمان العربي" },
        { bankCode: "56", bankNameEng: "OMAN INTERNATIONAL BANK", bankNameArb: "بنك عمان الدولي" },
        { bankCode: "57", bankNameEng: "COMMERCIAL BANK OF OMAN", bankNameArb: "البنك التجاري العماني" },
        { bankCode: "58", bankNameEng: "HABIB BANK Ltd.", bankNameArb: "بنك حبيب المحدود" },
        { bankCode: "59", bankNameEng: "HABIB BANK A.G.ZURICH", bankNameArb: "بنك حبيب زيوريخ" },
        { bankCode: "60", bankNameEng: "BANK AL AHLI AL OMANI", bankNameArb: "البنك الأهلي العماني" },
        { bankCode: "61", bankNameEng: "BANK OF OMAN BAHRAIN AND KUWAIT", bankNameArb: "بنك عمان والبحرين والكويت" },
        { bankCode: "62", bankNameEng: "BANK DHOFAR", bankNameArb: "بنك ظفار" },
        { bankCode: "63", bankNameEng: "Bank Of Baroda", bankNameArb: "بنك بارودا" },
        { bankCode: "64", bankNameEng: "Standard Chartered Bank", bankNameArb: "بنك ستاندرد تشارترد" },
        { bankCode: "65", bankNameEng: "Bank Saderat Iran", bankNameArb: "بنك صادرات إيران" },
        { bankCode: "70", bankNameEng: "Oman Housing Bank", bankNameArb: "بنك الإسكان العماني" },
        { bankCode: "72", bankNameEng: "First Abu-Dhabi Bank", bankNameArb: "بنك أبوظبي الأول" },
        { bankCode: "73", bankNameEng: "OMAN INVESTMENT & FINANCE", bankNameArb: "الاستثمار والتمويل العماني" },
        { bankCode: "75", bankNameEng: "AL AHLI BANK", bankNameArb: "البنك الأهلي" },
        { bankCode: "76", bankNameEng: "Bank of Beirut", bankNameArb: "بنك بيروت" },
        { bankCode: "77", bankNameEng: "Sohar Bank", bankNameArb: "بنك صحار" },
        { bankCode: "78", bankNameEng: "Bank Muscat", bankNameArb: "بنك مسقط" },
        { bankCode: "79", bankNameEng: "Development Bank", bankNameArb: "بنك التنمية" },
        { bankCode: "80", bankNameEng: "NIZWA BANK", bankNameArb: "بنك نزوى" },
        { bankCode: "81", bankNameEng: "NATIONAL QATAR BANK", bankNameArb: "بنك قطر الوطني" },
        { bankCode: "82", bankNameEng: "MAISARA BANK", bankNameArb: "بنك ميسرة" },
        { bankCode: "83", bankNameEng: "ALIZZ ISLAMIC BANK", bankNameArb: "بنك العز الإسلامي" },
        { bankCode: "84", bankNameEng: "ALYUSR ISLAMIC BANK", bankNameArb: "بنك اليسر الإسلامي" },
        { bankCode: "85", bankNameEng: "Al Ahli Islamic Banking", bankNameArb: "الأهلي الإسلامي" },
        { bankCode: "86", bankNameEng: "Meethaq Islamic Bank", bankNameArb: "ميثاق الإسلامي" },
        { bankCode: "87", bankNameEng: "MUZN ISLAMIC BANKING", bankNameArb: "مزن الإسلامي" },
        { bankCode: "88", bankNameEng: "BNP PARIBAS", bankNameArb: "بي إن بي باريبا" },
    ];
    
    const [bankList, setBankList] = useState(FALLBACK_BANK_LIST);
    const [bankListLoading, setBankListLoading] = useState(true);

    // Fetch bank list on component mount (with fallback)
    useEffect(() => {
        setBankListLoading(true);
        getBankList()
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setBankList(res.data);
                } else {
                    // Use fallback if API returns empty
                    setBankList(FALLBACK_BANK_LIST);
                }
                setBankListLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch bank list, using fallback:", err);
                // Use fallback on error
                setBankList(FALLBACK_BANK_LIST);
                setBankListLoading(false);
            });
    }, []);

    const [errors, setErrors] = useState({});
    const validationMessages = {
        required: t("validation.fieldRequired"),
        email: t("validation.invalidEmail"),
        phone8: t("validation.phone8Digits"),
       // account16: t("validation.account16Digits"),
        numeric: t("validation.numericOnly"),
        max16: t("validation.max16Digits"),
        max5: t("validation.max5Digits"),
    };


    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [crNotFoundMsg, setCrNotFoundMsg] = useState("");
    const [loadingCrCheck, setLoadingCrCheck] = useState(false);


    useEffect(() => {
        if (!formData.crNumber || crChecked) return;

        const timer = setTimeout(() => {
            setCrMessage("");
        }, 3000);

        getCompanyByCr(formData.crNumber)
            .then((res) => {
                const d = res.data;
                setFormData(prev => ({
                    ...prev,
                    rentContractNumber: d.contractNumber ?? "",
                    licenseNumber: d.licenseNumber ?? "",
                    taxRegistrationNumber: d.taxRegistrationNumber ?? "",
                    beneficiaryNumber: d.beneficiaryNumber ?? "",
                    poBox: d.poBox ?? "",
                    postalCode: d.postalCode ?? "",
                    phone: d.phone ?? "",
                    fax: d.fax ?? "",
                    mobile: d.mobile ?? "",
                    // ═══════════════════════════════════════════════════════════════
                    // BANK - Now stores CODE (dropdown will display name)
                    // Backend returns bankCode (e.g., "78")
                    // ═══════════════════════════════════════════════════════════════
                    bankCode: d.bankCode ?? d.bankName ?? "",  // bankCode from backend
                    accountNumber: d.accountNumber ?? "",
                    email: d.email ?? "",
                    fees: d.fees ?? prev.fees,
                    yearsToRenew: d.yearsToRenew ?? prev.yearsToRenew,
                }));

                setCrMessage(t("Company details auto-filled from existing record"));
                setCrMessageType("info");
                setCrChecked(true);
            })
            .catch(() => {
                setCrMessage(
                    t("CR number does not exist. Please fill mandatory details manually.")
                );
                setCrMessageType("warning");
                setCrChecked(true);
            });
            
        return () => clearTimeout(timer);
    }, [formData.crNumber]);


    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            fees: prev.yearsToRenew ? Number(prev.yearsToRenew) * 10 : prev.fees,
        }));
    }, [formData.yearsToRenew]);



    const validateAll = () => {
        const newErrors = {};

        if (!formData.rentContractNumber)
            newErrors.rentContractNumber = validationMessages.required;

        if (!formData.licenseNumber)
            newErrors.licenseNumber = validationMessages.required;

        if (!formData.taxRegistrationNumber)
            newErrors.taxRegistrationNumber = validationMessages.required;

        if (!formData.beneficiaryNumber)
            newErrors.beneficiaryNumber = validationMessages.required;

        if (!formData.poBox)
            newErrors.poBox = validationMessages.required;

        if (!formData.postalCode)
            newErrors.postalCode = validationMessages.required;

        if (!formData.phone || formData.phone.length !== 8)
            newErrors.phone = validationMessages.phone8;

        if (!formData.fax || formData.fax.length !== 8)
            newErrors.fax = validationMessages.phone8;

        if (!formData.mobile || formData.mobile.length !== 8)
            newErrors.mobile = validationMessages.phone8;

        if (!formData.email)
            newErrors.email = validationMessages.required;
        else if (!emailRegex.test(formData.email))
            newErrors.email = validationMessages.email;

        // ═══════════════════════════════════════════════════════════════
        // BANK - Now validates bankCode (not bankName)
        // ═══════════════════════════════════════════════════════════════
        if (!formData.bankCode)
            newErrors.bankCode = validationMessages.required;

        // if (!formData.accountNumber)
        //     newErrors.accountNumber = validationMessages.required;
        // else if (formData.accountNumber.length !== 14)
        //     newErrors.accountNumber = validationMessages.account16;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleNext = () => {
        const isValid = validateAll();

        if (!isValid) {
            setAlertMessage(t("validation.correctHighlightedFields"));
            setShowAlert(true);
            return;
        }

        setShowAlert(false);
        setAlertMessage("");
        next();
    };

    useEffect(() => {
        if (Object.keys(errors).length === 0) {
            setShowAlert(false);
        }
    }, [errors]);


    // EXACT SAME STYLE AS COMPANY DETAILS
    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
            "& fieldset": {
                borderColor: "#e0e0e0",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1d4a6d",
                borderWidth: "1px",
            },
        },
        "& .MuiInputBase-input": {
            fontSize: "12px",
            padding: "8px 10px",
        },
        "& .MuiInputLabel-root": {
            transform: "translate(14px, -9px) scale(0.85)",
            background: "#fff",
            padding: "0 4px",
            color: "#1d4a6d",
            fontSize: "12px",
            fontWeight: 700,
        },
        "& .MuiInputLabel-asterisk": {
            color: "#ef5350",
            fontWeight: "bold",
        },
    };

    // Select field style (same as fieldSx but with select adjustments)
    const selectFieldSx = {
        "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
            "& fieldset": {
                borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
                borderColor: "#e0e0e0",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1d4a6d",
                borderWidth: "1px",
            },
        },
        "& .MuiSelect-select": {
            fontSize: "12px",
            padding: "8px 10px !important",
            textAlign: isRTL ? "right" : "left",
        },
        "& .MuiInputLabel-root": {
            transform: "translate(14px, -9px) scale(0.85)",
            background: "#fff",
            padding: "0 4px",
            color: "#1d4a6d",
            fontSize: "12px",
            fontWeight: 700,
        },
        "& .MuiInputLabel-asterisk": {
            color: "#ef5350",
            fontWeight: "bold",
        },
        "& .MuiSvgIcon-root": {
            color: "#1d4a6d !important",
            fontSize: "18px",
        },
    };

    const selectMenuProps = {
        PaperProps: {
            sx: {
                maxHeight: "250px",
                borderRadius: "10px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                "& .MuiMenuItem-root": {
                    fontSize: "12px",
                    padding: "8px 12px",
                    minHeight: "32px",
                },
                "& .MuiMenuItem-root:hover": {
                    backgroundColor: "rgba(29, 74, 109, 0.08)",
                },
                "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "rgba(29, 74, 109, 0.15)",
                },
            },
        },
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // HELPER: Get bank name for display (used in Summary page)
    // ═══════════════════════════════════════════════════════════════════════════
    const getSelectedBankName = () => {
        if (!formData.bankCode) return "";
        const bank = bankList.find(b => b.bankCode === formData.bankCode);
        return bank ? (isRTL && bank.bankNameArb ? bank.bankNameArb : bank.bankNameEng) : formData.bankCode;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
                <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
                    {/* PAGE TITLE */}
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 1,
                            mb: 1.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: "#1d4a6d",
                                fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.35rem" },
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                mb: 0.5,
                            }}
                        >
                            {t("page.companyRegistration")}
                        </Typography>
                    </Box>
                </Box>

                {/* ALERT */}
                {showAlert && (
                    <Box sx={{ mb: 1 }}>
                        <Alert
                            severity="error"
                            onClose={() => setShowAlert(false)}
                            sx={{
                                direction: isRTL ? "rtl" : "ltr",
                                textAlign: isRTL ? "right" : "left",
                                py: 0.5,
                                px: 1.5,
                                minHeight: "40px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#ffebee",
                                color: "#bd5555",
                                border: "1px solid #f5b3b3",
                                borderRadius: "12px",
                                boxShadow: "0 2px 6px rgba(189, 84, 84, 0.1)",
                                "& .MuiAlert-message": {
                                    padding: 0,
                                    margin: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    color: "#bd5555",
                                },
                                "& .MuiAlert-icon": {
                                    fontSize: "18px",
                                    marginRight: isRTL ? 0 : "8px",
                                    marginLeft: isRTL ? "8px" : 0,
                                    padding: 0,
                                    color: "#e77070",
                                },
                            }}
                        >
                            {alertMessage || t("validation.fillAllRequired")}
                        </Alert>
                    </Box>
                )}

                {crMessage && (
                    <Box sx={{ mb: 1 }}>
                        <Alert
                            severity={crMessageType}
                            
                            sx={{
                                fontSize: "12px",
                                borderRadius: "12px",
                            }}
                        >
                            {crMessage}
                        </Alert>
                    </Box>
                )}


                {crNotFoundMsg && (
                    <Box sx={{ mb: 1 }}>
                        <Alert

                            severity={alertMessage.includes("auto-filled") ? "info" : "warning"}
                            onClose={() => setCrNotFoundMsg("")}
                            sx={{
                                direction: isRTL ? "rtl" : "ltr",
                                textAlign: isRTL ? "right" : "left",
                                py: 0.5,
                                px: 1.5,
                                minHeight: "40px",
                                borderRadius: "12px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                "& .MuiAlert-message": {
                                    fontSize: "12px",
                                    fontWeight: 600,
                                },
                            }}
                        >
                            {crNotFoundMsg}
                        </Alert>
                    </Box>
                )}


                {/* OTHER INFORMATION CARD */}
                <Card
                    sx={{
                        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.08)",
                        borderRadius: "16px",
                        mb: 0.75,
                        border: "1px solid #f0f0f0",
                    }}
                >
                    <CardContent
                        sx={{
                            pt: { xs: 0.5, sm: 1, md: 1 },
                            px: { xs: 0.5, sm: 1, md: 1.5 },
                            pb: { xs: 0.25, sm: 0.5 },
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                color: "#1d4a6d",
                                mt: 0.5,
                                mb: 0.5,
                                fontSize: "18px",
                                lineHeight: 1.1,
                                textAlign: "left",
                            }}
                        >
                            {t("section.contractInformation")}
                        </Typography>

                        <Divider sx={{ mt: 0.75, mb: 2.3, backgroundColor: "#e8e8e8" }} />

                        {/* ROW 1 */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                                mt: 0.5,
                                mb: 3,
                            }}
                        >
                            {/* Rent Contract Number */}
                            <Box sx={{ flex: "0 0 180px", maxWidth: "180px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.rentContractNumber")}
                                    value={formData.rentContractNumber || ""}
                                    onChange={(e) => {
                                        const value = maxLengthAny(e.target.value, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            rentContractNumber: value,
                                        }));
                                    }}



                                    error={errors.rentContractNumber}
                                    helperText={errors.rentContractNumber ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* License Number */}
                            <Box sx={{ flex: "0 0 180px", maxWidth: "180px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.licenseNumber")}
                                    value={formData.licenseNumber || ""}
                                    onChange={(e) => {
                                        const value = maxLengthAny(e.target.value, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            licenseNumber: value,
                                        }));
                                    }}



                                    error={errors.licenseNumber}
                                    helperText={errors.licenseNumber ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Tax Registration Number */}
                            <Box sx={{ flex: "0 0 190px", maxWidth: "190px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.taxRegistrationNumber")}
                                    value={formData.taxRegistrationNumber || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            taxRegistrationNumber: value,
                                        }));
                                    }}



                                    error={errors.taxRegistrationNumber}
                                    helperText={errors.taxRegistrationNumber ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Beneficiary Number */}
                            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.beneficiaryNumber")}
                                    value={formData.beneficiaryNumber || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            beneficiaryNumber: value,
                                        }));
                                    }}



                                    error={errors.beneficiaryNumber}
                                    helperText={errors.beneficiaryNumber ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>
                        </Box>

                        {/* ROW 2 */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                                mt: 0.5,
                                mb: 0,
                            }}
                        >
                            {/* P.O. Box */}
                            <Box sx={{ flex: "0 0 90px", maxWidth: "90px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.poBox")}
                                    value={formData.poBox || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 5);
                                        setFormData(prev => ({
                                            ...prev,
                                            poBox: value,
                                        }));
                                    }}



                                    error={errors.poBox}
                                    helperText={errors.poBox ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Postal Code */}
                            <Box sx={{ flex: "0 0 110px", maxWidth: "110px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.postalCode")}
                                    value={formData.postalCode || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 5);
                                        setFormData(prev => ({
                                            ...prev,
                                            postalCode: value,
                                        }));
                                    }}



                                    error={errors.postalCode}
                                    helperText={errors.postalCode ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Phone */}
                            <Box sx={{ flex: "0 0 110px", maxWidth: "110px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.phone")}
                                    value={formData.phone || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 8);
                                        setFormData(prev => ({
                                            ...prev,
                                            phone: value,
                                        }));
                                    }}



                                    error={errors.phone}
                                    helperText={errors.phone ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Fax */}
                            <Box sx={{ flex: "0 0 90px", maxWidth: "90px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.fax")}
                                    value={formData.fax || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 8);
                                        setFormData(prev => ({
                                            ...prev,
                                            fax: value,
                                        }));
                                    }}



                                    error={errors.fax}
                                    helperText={errors.fax ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Mobile */}
                            <Box sx={{ flex: "0 0 130px", maxWidth: "130px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.mobile")}
                                    value={formData.mobile || ""}
                                    onChange={(e) => {
                                        const value = onlyNumbers(e.target.value, 8);
                                        setFormData(prev => ({
                                            ...prev,
                                            mobile: value,
                                        }));
                                    }}



                                    error={errors.mobile}
                                    helperText={errors.mobile ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>

                            {/* Email */}
                            <Box sx={{ flex: "0 0 280px", minWidth: "280px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.email")}
                                    value={formData.email || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            email: value,
                                        }));
                                    }}


                                    error={Boolean(errors.email)}
                                    helperText={errors.email || ""}


                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* PAYMENT INFORMATION CARD */}
                <Card
                    sx={{
                        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.08)",
                        borderRadius: "16px",
                        mb: 0.75,
                        border: "1px solid #f0f0f0",
                    }}
                >
                    <CardContent
                        sx={{
                            pt: { xs: 0.5, sm: 1, md: 1 },
                            px: { xs: 0.5, sm: 1, md: 1.5 },
                            pb: { xs: 0.25, sm: 0.5 },
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 500,
                                color: "#1d4a6d",
                                mt: 0.5,
                                mb: 0.5,
                                fontSize: "18px",
                                lineHeight: 1.1,
                                textAlign: "left",
                            }}
                        >
                            {t("section.paymentInformation")}
                        </Typography>

                        <Divider sx={{ mt: 0.75, mb: 2.3, backgroundColor: "#e8e8e8" }} />

                        {/* ROW 1 */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: 3,
                                flexWrap: "wrap",
                                mt: 0.5,
                                mb: 3,
                            }}
                        >
                            {/* ═══════════════════════════════════════════════════════════════
                                BANK NAME - NOW FROM DATABASE
                                - Value: bankCode (stored in DB)
                                - Display: bankNameEng (shown in dropdown)
                            ═══════════════════════════════════════════════════════════════ */}
                            <Box sx={{ flex: "0 0 280px", maxWidth: "280px" }}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label={t("fields.bankName")}
                                    value={formData.bankCode || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            bankCode: value,
                                        }));
                                    }}
                                    error={Boolean(errors.bankCode)}
                                    helperText={errors.bankCode ? t("validation.fieldRequired") : ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={selectFieldSx}
                                    SelectProps={{ MenuProps: selectMenuProps }}
                                    disabled={bankListLoading}
                                >
                                    {bankListLoading ? (
                                        <MenuItem disabled>
                                            <CircularProgress size={16} sx={{ mr: 1 }} />
                                            Loading...
                                        </MenuItem>
                                    ) : (
                                        bankList.map((bank) => (
                                            <MenuItem key={bank.bankCode} value={bank.bankCode}>
                                                {isRTL && bank.bankNameArb ? bank.bankNameArb : bank.bankNameEng}
                                            </MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Box>

                            {/* Account Number */}
                            <Box sx={{ flex: "0 0 180px", maxWidth: "180px" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label={t("fields.accountNumber")}
                                    value={formData.accountNumber ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            accountNumber: value,
                                        }));
                                    }}

                                    error={Boolean(errors.accountNumber)}
                                    helperText={errors.accountNumber || ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />



                            </Box>

                            {/* Fees */}
                            <Box sx={{ flex: "0 0 180px", maxWidth: "180px" }}>
                                <TextField
                                    fullWidth
                                    disabled
                                    label={t("fields.fees")}
                                    value={formData.fees || ""}
                                    InputLabelProps={{ shrink: true }}
                                    sx={fieldSx}
                                />

                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* BUTTONS */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        mt: 1.5,
                        mb: { xs: 1.5, md: 2 },
                    }}
                >
                    {/* BACK BUTTON */}
                    <Button
                        variant="outlined"
                        onClick={back}
                        sx={{
                            height: "40px",
                            minWidth: "auto",
                            px: 2,
                            borderRadius: "12px",
                            fontWeight: 400,
                            fontSize: "10px",
                            textTransform: "none",
                            color: "#1d4a6d",
                            borderColor: "#1d4a6d",
                            background: "rgba(29, 74, 109, 0.06)",
                            boxShadow: "0 2px 8px rgba(29, 70, 109, 0.3)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                                color: "#ffffff",
                                borderColor: "#1d4a6d",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(29, 70, 109, 0.4)",
                            },
                        }}
                    >
                        {isRTL ? `${t("buttons.back")} →` : `← ${t("buttons.back")}`}
                    </Button>

                    {/* NEXT BUTTON */}
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                            height: "40px",
                            minWidth: "auto",
                            px: 2,
                            borderRadius: "12px",
                            fontWeight: 400,
                            fontSize: "10px",
                            textTransform: "none",
                            background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                            color: "#ffffff",
                            boxShadow: "0 2px 8px rgba(29, 70, 109, 0.3)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(29, 70, 109, 0.4)",
                            },
                        }}
                    >
                        {isRTL ? `← ${t("buttons.next")}` : `${t("buttons.next")} →`}
                    </Button>
                </Box>
            </ThemeProvider>
        </LocalizationProvider>
    );
}
