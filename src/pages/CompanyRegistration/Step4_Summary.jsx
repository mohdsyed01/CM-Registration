import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Dialog,
  CircularProgress,
  Backdrop,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { createCompanySR } from "../../api/companyApi";
import { getBankNameByCode } from "../../utils/bankUtils";

const theme = createTheme({
  palette: {
    primary: { main: "#1d466dff" },
  },
});

export default function Step4_Summary({ formData, next, back, setSrDetails }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const canvasRef = useRef(null);

  // Accordion state - all closed by default
  const [expanded, setExpanded] = useState({
    company: false,
    sme: false,
    other: false,
    bank: false,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  const processingSteps = [
    { key: "creating", label: t("loading.creatingRequest", "Validating details") },
    { key: "checking", label: t("loading.checkingSR", "Checking records") },
    { key: "finalizing", label: t("loading.finalizing", "Finalizing request") },
  ];

  const displayBankName = getBankNameByCode(
    formData.bankCode,
    i18n.language === "ar" ? "ar" : "en"
  );

  const buildCreateSrPayload = () => ({
    crNumber: formData.crNumber,
    companyName: formData.companyName,
    occiNumber: formData.occiNumber,
    expiry: formData.occiExpiry ? formData.occiExpiry.format("YYYY-MM-DD") : null,
    degree: formData.degree,
    yearsToRenew: formData.yearsToRenew,
    isSme: formData.isSme,
    smeType: formData.smeType,
    isRiyadaRegistered: formData.isRiyadaRegistered,
    riyadaExpiry: formData.riydaExpiry ? formData.riydaExpiry.format("YYYY-MM-DD") : null,
    rentContractNumber: formData.rentContractNumber,
    licenseNumber: formData.licenseNumber,
    taxRegistrationNumber: formData.taxRegistrationNumber,
    beneficiaryNumber: formData.beneficiaryNumber,
    poBox: formData.poBox,
    postalCode: formData.postalCode,
    phone: formData.phone,
    fax: formData.fax,
    mobile: formData.mobile,
    email: formData.email,
    bankCode: formData.bankCode,
    bankName: displayBankName,
    accountNumber: formData.accountNumber,
    fees: formData.fees,
    userId: "UI_USER",
  });

  const handleProceed = async () => {
    if (!captchaVerified) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    setProcessing(true);
    setProcessingStep(0);
    setProgress(10);

    try {
      const payload = buildCreateSrPayload();
      setProcessingStep(0);
      setProgress(30);

      const response = await createCompanySR(payload);
      setProcessingStep(1);
      setProgress(70);

      const sr = response.data;
      setSrDetails(sr);

      if (!sr || !sr.incidentId) {
        alert(t("validation.apiError", "Invalid response from server"));
        return;
      }

      if (sr.code && sr.code !== "SUCCESS" && sr.code !== "SR_EXISTS") {
        alert(sr.message || t("validation.apiError", "Unable to process request"));
        return;
      }

      setProcessingStep(2);
      setProgress(100);

      setTimeout(() => {
        setProcessing(false);
        if (sr.existingSR || !sr.paymentRequired) {
          next("SR_DETAILS");
        } else if (sr.paymentRequired) {
          next("PAYMENT");
        } else {
          next("SR_DETAILS");
        }
      }, 800);
    } catch (error) {
      console.error("SR creation failed", error);
      setProcessing(false);
      let errorMsg = t("validation.apiError", "Backend not reachable");
      if (error.response) {
        errorMsg = error.response.data?.message || "Backend error (" + error.response.status + ")";
      } else if (error.request) {
        errorMsg = t("validation.apiError", "No response from backend");
      }
      alert(errorMsg);
    }
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    drawCaptcha(code);
  };

  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#f8fafc");
    gradient.addColorStop(1, "#e8f0f7");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#1d4a6d";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    ctx.save();
    const shieldX = 20;
    ctx.translate(shieldX, height / 2);
    ctx.fillStyle = "#1d4a6d";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10, -8);
    ctx.lineTo(10, 6);
    ctx.quadraticCurveTo(10, 12, 0, 16);
    ctx.quadraticCurveTo(-10, 12, -10, 6);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(-1, 3);
    ctx.lineTo(4, -3);
    ctx.stroke();
    ctx.restore();

    const startX = 50;
    const endX = width - 10;
    const spacing = (endX - startX) / code.length;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = startX + spacing * i + spacing / 2;
      const y = height / 2;
      const angle = (Math.random() - 0.5) * 0.3;
      const yOffset = Math.random() * 5 - 2.5;

      ctx.save();
      ctx.translate(x, y + yOffset);
      ctx.rotate(angle);

      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char, 1.5, 1.5);

      const textGradient = ctx.createLinearGradient(0, -12, 0, 12);
      textGradient.addColorStop(0, "#1d4a6d");
      textGradient.addColorStop(1, "#0d2438");
      ctx.fillStyle = textGradient;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  };

  const verifyCaptcha = () => {
    setCaptchaError("");
    if (userCaptchaInput.toUpperCase() === captchaCode) {
      setCaptchaVerified(true);
    } else {
      setCaptchaError(t("captcha.error", "Invalid CAPTCHA. Please try again."));
      setCaptchaVerified(false);
      setUserCaptchaInput("");
      generateCaptcha();
    }
  };

  const refreshCaptcha = () => {
    setUserCaptchaInput("");
    setCaptchaVerified(false);
    setCaptchaError("");
    generateCaptcha();
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (captchaCode) {
      drawCaptcha(captchaCode);
    }
  }, [isRTL, captchaCode]);

  const show = (v) => (v && v !== "" && v !== null ? v : "—");
  const yesNo = (v) => {
    if (v === true || v === "true" || v === 1 || v === "1" || v === "Yes" || v === "yes")
      return t("common.yes", "Yes");
    if (v === false || v === "false" || v === 0 || v === "0" || v === "No" || v === "no")
      return t("common.no", "No");
    return "—";
  };

  // Field styling matching SRDetailsPage
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      height: "40px",
      borderRadius: "12px",
      backgroundColor: "#fffef5",
      "& fieldset": { borderColor: "#e0e0e0" },
      "&.Mui-focused fieldset": { borderColor: "#1d4a6d", borderWidth: "1px" },
    },
    "& .MuiInputBase-input": {
      fontSize: "12px",
      padding: "8px 10px",
      textAlign: isRTL ? "right" : "left",
    },
    "& .MuiInputLabel-root": {
      right: isRTL ? 14 : "unset",
      left: isRTL ? "unset" : 14,
      transformOrigin: isRTL ? "top right" : "top left",
      transform: isRTL ? "translate(-14px, -9px) scale(0.85)" : "translate(14px, -9px) scale(0.85)",
      background: "#fff",
      padding: "0 4px",
      color: "#1d4a6d",
      fontSize: "12px",
      fontWeight: 700,
    },
    "& .Mui-disabled": {
      WebkitTextFillColor: "#18181b !important",
      color: "#18181b !important",
    },
    "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e0e0e0 !important",
    },
  };

  // Accordion styling
  const accordionSx = {
    boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.08)",
    borderRadius: "16px !important",
    mb: 0.5,
    border: "1px solid #f0f0f0",
    "&:before": { display: "none" },
    "&.Mui-expanded": { margin: "0 0 4px 0" },
  };

  const accordionSummarySx = {
    minHeight: "42px !important",
    padding: "0 12px",
    flexDirection: isRTL ? "row-reverse" : "row",
    "& .MuiAccordionSummary-content": {
      margin: "8px 0 !important",
      alignItems: "center",
      gap: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    "& .MuiAccordionSummary-expandIconWrapper": {
      color: "#1d4a6d",
      transform: isRTL ? "rotate(0deg)" : "rotate(0deg)",
      marginLeft: isRTL ? 0 : "auto",
      marginRight: isRTL ? "auto" : 0,
    },
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(180deg)",
    },
  };

  const sectionTitleSx = {
    fontWeight: 500,
    color: "#1d4a6d",
    fontSize: "16px",
    lineHeight: 1.1,
  };

  const sectionIconSx = {
    color: "#1d4a6d",
    fontSize: 20,
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
        {/* PAGE TITLE */}
        <Box sx={{ textAlign: "center", mb: 0.5 }}>
          <Typography sx={{ fontWeight: 600, color: "#1d4a6d", fontSize: "1.2rem" }}>
            {t("step.summary", "Summary")}
          </Typography>
        </Box>

        {/* ALERT */}
        {showAlert && (
          <Alert
            severity="error"
            onClose={() => setShowAlert(false)}
            sx={{
              mb: 0.75,
              borderRadius: "10px",
              fontSize: "12px",
              py: 0.5,
              direction: isRTL ? "rtl" : "ltr",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("captcha.error", "Please verify CAPTCHA before proceeding")}
          </Alert>
        )}

        {/* SECTION 1: COMPANY DETAILS */}
        <Accordion expanded={expanded.company} onChange={handleAccordionChange("company")} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
            <BusinessIcon sx={sectionIconSx} />
            <Typography sx={sectionTitleSx}>{t("section.companyDetails", "Company Details")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1, px: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 280px", minWidth: "200px" }}>
                <TextField fullWidth disabled label={t("fields.companyName", "Company Name")} value={show(formData.companyName)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 120px" }}>
                <TextField fullWidth disabled label={t("fields.crNumber", "CR Number")} value={show(formData.crNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 130px" }}>
                <TextField fullWidth disabled label={t("fields.occiNumber", "OCCI Number")} value={show(formData.occiNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 140px" }}>
                <TextField fullWidth disabled label={t("fields.occiExpiryDate", "OCCI Expiry")} value={formData.occiExpiry ? formData.occiExpiry.format("YYYY-MM-DD") : "—"} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 120px" }}>
                <TextField fullWidth disabled label={t("fields.yearsToRenew", "Years To Renew")} value={show(formData.yearsToRenew)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 100px" }}>
                <TextField fullWidth disabled label={t("fields.degree", "Degree")} value={show(formData.degree)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* SECTION 2: SME & RIYADA DETAILS */}
        <Accordion expanded={expanded.sme} onChange={handleAccordionChange("sme")} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
            <StorefrontIcon sx={sectionIconSx} />
            <Typography sx={sectionTitleSx}>{t("section.smeRiyadaDetails", "SME & Riyada Details")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1, px: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "0 0 120px" }}>
                <TextField fullWidth disabled label={t("fields.isSme", "Is SME?")} value={yesNo(formData.isSme)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 140px" }}>
                <TextField fullWidth disabled label={t("fields.smeType", "SME Type")} value={show(formData.smeType)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 160px" }}>
                <TextField fullWidth disabled label={t("fields.isRiyadaRegistered", "Riyada Registered?")} value={yesNo(formData.isRiyadaRegistered)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 140px" }}>
                <TextField fullWidth disabled label={t("fields.riydaCardExpiry", "Riyada Expiry")} value={formData.riydaExpiry ? formData.riydaExpiry.format("YYYY-MM-DD") : "—"} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* SECTION 3: OTHER INFORMATION */}
        <Accordion expanded={expanded.other} onChange={handleAccordionChange("other")} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
            <ContactMailIcon sx={sectionIconSx} />
            <Typography sx={sectionTitleSx}>{t("section.otherInformation", "Other Information")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1, px: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "0 0 160px" }}>
                <TextField fullWidth disabled label={t("fields.rentContractNumber", "Rent Contract Number")} value={show(formData.rentContractNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 130px" }}>
                <TextField fullWidth disabled label={t("fields.licenseNumber", "License Number")} value={show(formData.licenseNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 160px" }}>
                <TextField fullWidth disabled label={t("fields.taxRegistrationNumber", "Tax Registration")} value={show(formData.taxRegistrationNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "1 1 200px" }}>
                <TextField fullWidth disabled label={t("fields.beneficiaryNumber", "Beneficiary Number")} value={show(formData.beneficiaryNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 90px" }}>
                <TextField fullWidth disabled label={t("fields.poBox", "P.O. Box")} value={show(formData.poBox)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 110px" }}>
                <TextField fullWidth disabled label={t("fields.postalCode", "Postal Code")} value={show(formData.postalCode)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 120px" }}>
                <TextField fullWidth disabled label={t("fields.phone", "Phone")} value={show(formData.phone)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 100px" }}>
                <TextField fullWidth disabled label={t("fields.fax", "Fax")} value={show(formData.fax)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 120px" }}>
                <TextField fullWidth disabled label={t("fields.mobile", "Mobile")} value={show(formData.mobile)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "1 1 200px" }}>
                <TextField fullWidth disabled label={t("fields.email", "Email")} value={show(formData.email)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* SECTION 4: BANK / PAYMENT DETAILS */}
        <Accordion expanded={expanded.bank} onChange={handleAccordionChange("bank")} sx={accordionSx}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
            <AccountBalanceIcon sx={sectionIconSx} />
            <Typography sx={sectionTitleSx}>{t("section.bankDetails", "Bank / Payment Details")}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 1, px: 1.5 }}>
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
              <Box sx={{ flex: "0 0 200px" }}>
                <TextField fullWidth disabled label={t("fields.bankName", "Bank Name")} value={show(displayBankName)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 160px" }}>
                <TextField fullWidth disabled label={t("fields.accountNumber", "Account Number")} value={show(formData.accountNumber)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
              <Box sx={{ flex: "0 0 80px" }}>
                <TextField fullWidth disabled label={t("fields.fees", "Fees")} value={show(formData.fees)} InputLabelProps={{ shrink: true }} sx={fieldSx} />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* CAPTCHA SECTION */}
        <Card sx={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)", borderRadius: "14px", mb: 0.75, border: "1px solid #e4e4e7" }}>
          <CardContent sx={{ p: 1.75 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, mb: 1 }}>
              <SecurityIcon sx={{ fontSize: 18, color: "#1d4a6d" }} />
              <Typography sx={{ fontWeight: 700, color: "#1d4a6d", fontSize: "13px", letterSpacing: "0.3px" }}>
                {t("captcha.title", "Security Verification")}
              </Typography>
            </Box>

            <Box
              sx={{
                height: "2px",
                background: "linear-gradient(90deg, transparent, #1d4a6d 20%, #1d4a6d 80%, transparent)",
                mb: 1.25,
                borderRadius: "2px",
              }}
            />

            {/* CAPTCHA ERROR */}
            {captchaError && (
              <Alert
                severity="error"
                onClose={() => setCaptchaError("")}
                sx={{
                  mb: 0.75,
                  fontSize: "10px",
                  py: 0.4,
                  direction: isRTL ? "rtl" : "ltr",
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {captchaError}
              </Alert>
            )}

            {/* CAPTCHA VERIFIED - BADGE STYLE */}
            {captchaVerified && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 0.75,
                  py: 0.75,
                  px: 2,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: "20px",
                  maxWidth: "fit-content",
                  mx: "auto",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                }}
              >
                <VerifiedIcon sx={{ fontSize: 16, color: "#fff" }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>
                  {t("captcha.verified", "Verified")}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
                <canvas
                  ref={canvasRef}
                  width={160}
                  height={50}
                  style={{ border: "2px solid #1d4a6d", borderRadius: "8px", cursor: "pointer" }}
                  onClick={refreshCaptcha}
                />
                <Button
                  onClick={refreshCaptcha}
                  startIcon={<RefreshIcon sx={{ fontSize: 12 }} />}
                  sx={{ color: "#1d4a6d", fontSize: "9px", textTransform: "none", p: 0.3 }}
                >
                  {t("captcha.refresh", "Refresh")}
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: isRTL ? "row-reverse" : "row" }}>
                <TextField
                  placeholder={t("captcha.placeholder", "Enter code")}
                  value={userCaptchaInput}
                  onChange={(e) => setUserCaptchaInput(e.target.value.toUpperCase())}
                  disabled={captchaVerified}
                  sx={{
                    width: "115px",
                    "& .MuiOutlinedInput-root": { height: "30px", borderRadius: "8px" },
                    "& .MuiInputBase-input": {
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textAlign: "center",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={verifyCaptcha}
                  disabled={!userCaptchaInput || captchaVerified}
                  sx={{
                    height: "30px",
                    minWidth: "70px",
                    fontSize: "10px",
                    textTransform: "none",
                    borderRadius: "8px",
                    background: captchaVerified ? "#10b981" : "#1d4a6d",
                    "&:hover": {
                      background: captchaVerified ? "#059669" : "#163a56",
                    },
                  }}
                >
                  {captchaVerified ? t("captcha.verified", "Verified") : t("captcha.verify", "Verify")}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* INFO MESSAGE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            backgroundColor: "#fef3c7",
            border: "1px solid #fbbf24",
            borderRadius: "10px",
            p: 0.75,
            mb: 0.75,
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <InfoIcon sx={{ color: "#f59e0b", fontSize: 14 }} />
          <Typography sx={{ color: "#92400e", fontSize: "10px", fontWeight: 600, textAlign: "center" }}>
            {t("messages.confirmationMessage", "You will receive a confirmation message within 10 minutes of registration (maximum)")}
          </Typography>
        </Box>

        {/* ACTION BUTTONS */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mt: 1, mb: 1.5 }}>
          <Button
            variant="outlined"
            onClick={back}
            sx={{
              height: "32px",
              px: 2,
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "11px",
              textTransform: "none",
              color: "#1d4a6d",
              borderColor: "#1d4a6d",
              background: "rgba(29, 74, 109, 0.04)",
              boxShadow: "0 1px 4px rgba(29, 70, 109, 0.15)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                color: "#ffffff",
                borderColor: "#1d4a6d",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(29, 70, 109, 0.25)",
              },
            }}
          >
            {isRTL ? `${t("buttons.back", "Back")} →` : `← ${t("buttons.back", "Back")}`}
          </Button>

          <Button
            variant="contained"
            onClick={handleProceed}
            disabled={!captchaVerified}
            sx={{
              height: "32px",
              px: 2,
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "11px",
              textTransform: "none",
              background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
              color: "#ffffff",
              boxShadow: "0 1px 4px rgba(29, 70, 109, 0.2)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(29, 70, 109, 0.3)",
              },
              "&:disabled": {
                background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                color: "#ffffff",
              },
            }}
          >
            {isRTL
              ? `← ${t("buttons.proceedToPay", "Create Service Request")}`
              : `${t("buttons.proceedToPay", "Create Service Request")} →`}
          </Button>
        </Box>

        {/* LOADING DIALOG */}
        <Backdrop
          open={processing}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <Dialog
            open={processing}
            PaperProps={{
              sx: {
                borderRadius: "16px",
                p: 3.5,
                width: "360px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                direction: isRTL ? "rtl" : "ltr",
              },
            }}
          >
            <Box sx={{ mb: 3, display: "flex", justifyContent: "center", position: "relative" }}>
              <CircularProgress variant="determinate" value={100} size={80} thickness={2.5} sx={{ position: "absolute", color: "#e8edf2" }} />
              <CircularProgress variant="determinate" value={progress} size={80} thickness={2.5} sx={{ color: "#1d4a6d" }} />
              <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#1d4a6d" }}>{Math.round(progress)}%</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: "17px", color: "#1d4a6d", mb: 1 }}>
              {t("loading.processing", "Processing Request")}
            </Typography>

            <Typography sx={{ fontSize: "13px", color: "#64748b", mb: 3, minHeight: "40px", fontWeight: 500 }}>
              {processingSteps[processingStep]?.label || t("loading.pleaseWait", "Please wait...")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignItems: isRTL ? "flex-end" : "flex-start", px: 1 }}>
              {processingSteps.map((step, index) => {
                const isCompleted = processingStep > index;
                const isActive = processingStep === index;
                const isPending = processingStep < index;

                if (isPending) return null;

                return (
                  <Box
                    key={step.key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      width: "100%",
                      flexDirection: isRTL ? "row-reverse" : "row",
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: isCompleted ? "#10b981" : isActive ? "#1d4a6d" : "#e8edf2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isCompleted && <CheckCircleIcon sx={{ color: "#fff", fontSize: 16 }} />}
                      {isActive && <Box sx={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} />}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isCompleted ? "#10b981" : isActive ? "#1d4a6d" : "#94a3b8",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {step.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Dialog>
        </Backdrop>
      </Box>
    </ThemeProvider>
  );
}