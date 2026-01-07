import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Collapse,
  IconButton,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import ShieldIcon from "@mui/icons-material/Shield";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function Step4_Summary({ formData, next, back }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  // Collapse state for sections
  const [open, setOpen] = useState({
    company: true,
    contract: true,
    contact: true,
    payment: true,
  });

  // CAPTCHA state
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const canvasRef = useRef(null);

  // Generate random CAPTCHA code
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    drawCaptcha(code);
  };

  // Draw PREMIUM CAPTCHA on canvas with logo
  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Premium gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#f8fafc");
    gradient.addColorStop(1, "#e8f0f7");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Premium border with shadow effect
    ctx.strokeStyle = "#1d4a6d";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    // Add subtle geometric pattern
    ctx.strokeStyle = "rgba(29, 74, 109, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw premium logo/shield icon (left side)
    ctx.save();
    ctx.translate(30, height / 2);
    
    // Shield background
    ctx.fillStyle = "#1d4a6d";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(15, -15);
    ctx.lineTo(15, 10);
    ctx.quadraticCurveTo(15, 20, 0, 25);
    ctx.quadraticCurveTo(-15, 20, -15, 10);
    ctx.lineTo(-15, -15);
    ctx.closePath();
    ctx.fill();

    // Shield checkmark
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-2, 5);
    ctx.lineTo(6, -5);
    ctx.stroke();

    ctx.restore();

    // Add elegant noise dots
    for (let i = 0; i < 30; i++) {
      const alpha = Math.random() * 0.15;
      ctx.fillStyle = `rgba(29, 74, 109, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add premium curved lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(29, 74, 109, ${Math.random() * 0.1 + 0.05})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Draw CAPTCHA text with premium styling
    const startX = 80; // Start after logo
    const spacing = (width - startX - 20) / code.length;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = startX + spacing * i + spacing / 2;
      const y = height / 2;
      const angle = (Math.random() - 0.5) * 0.3;
      const yOffset = Math.random() * 8 - 4;

      ctx.save();
      ctx.translate(x, y + yOffset);
      ctx.rotate(angle);

      // Character shadow for depth
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.font = "bold 36px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char, 2, 2);

      // Main character with gradient
      const textGradient = ctx.createLinearGradient(0, -20, 0, 20);
      textGradient.addColorStop(0, "#1d4a6d");
      textGradient.addColorStop(1, "#0d2438");
      ctx.fillStyle = textGradient;
      ctx.fillText(char, 0, 0);

      // Text outline
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.strokeText(char, 0, 0);

      ctx.restore();
    }

    // Add premium "SECURE" watermark
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = "#1d4a6d";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SECURE", width / 2, height - 15);
    ctx.restore();
  };

  // Verify CAPTCHA
  const verifyCaptcha = () => {
    setCaptchaError("");
    if (userCaptchaInput.toUpperCase() === captchaCode) {
      setCaptchaVerified(true);
      setCaptchaError("");
    } else {
      setCaptchaError("Invalid CAPTCHA. Please try again.");
      setCaptchaVerified(false);
      setUserCaptchaInput("");
      generateCaptcha();
    }
  };

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setUserCaptchaInput("");
    setCaptchaVerified(false);
    setCaptchaError("");
    generateCaptcha();
  };

  // Initialize CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const toggle = (key) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const show = (v) => (v && v !== "" && v !== null ? v : "N/A");

  // Styled expand icon rotation
  const ExpandIcon = styled(IconButton)(({ expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    transition: "transform 0.3s ease",
  }));

  const sectionTitleStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#eef3f7",
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #d0d7df",
  };

  // Row container (box)
  const rowBox = {
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "18px",
    border: "1px solid #d0d7df",
    backgroundColor: "#f7f9fb",
  };

  // Disabled TextField style - Shows full text without truncation
  const fieldStyle = {
    width: "100%",
    "& .MuiInputBase-root": {
      backgroundColor: "#f0f4f8",
      borderRadius: "10px",
      minHeight: "60px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d0d7df",
    },
    "& .MuiInputBase-input": {
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "500",
      overflow: "visible",
      textOverflow: "clip",
      whiteSpace: "normal",
      wordBreak: "break-word",
      lineHeight: "1.6",
    },
    "& .Mui-disabled": {
      color: "#1d4a6d !important",
      WebkitTextFillColor: "#1d4a6d !important",
    },
  };

  const handleProceed = () => {
    if (!captchaVerified) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    next();
  };

  return (
    <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
      {/* PAGE TITLE */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1d4a6d",
          textAlign: "center",
          mb: 4,
        }}
      >
        {t("step.summary")}
      </Typography>

      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          border: "1px solid #e0e0e0",
        }}
      >
        <CardContent sx={{ p: 4 }}>

          {/* ========================= COMPANY DETAILS ========================= */}
          <Box sx={{ mb: 3 }}>
            <Box onClick={() => toggle("company")} sx={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("section.companyDetails")}
              </Typography>

              <ExpandIcon expand={open.company ? 1 : 0}>
                <ExpandMoreIcon />
              </ExpandIcon>
            </Box>

            <Collapse in={open.company}>
              <Divider sx={{ my: 2 }} />

              <Box sx={rowBox}>
                <Grid container spacing={2}>
                  {[
                    { label: t("fields.companyName"), value: formData.companyName },
                    { label: t("fields.crNumber"), value: formData.crNumber },
                    { label: t("fields.occiNumber"), value: formData.occiNumber },
                    {
                      label: t("fields.occiExpiryDate"),
                      value: formData.occiExpiry
                        ? formData.occiExpiry.format("YYYY-MM-DD")
                        : "",
                    },
                    { label: t("fields.yearsToRenew"), value: formData.yearsToRenew },
                    { label: t("fields.degree"), value: formData.degree },
                    {
                      label: t("fields.isSme"),
                      value: formData.isSme ? t("common.yes") : t("common.no"),
                    },
                    { label: t("fields.smeType"), value: formData.smeType },
                    {
                      label: t("fields.isRiyadaRegistered"),
                      value: formData.isRiyadaRegistered
                        ? t("common.yes")
                        : t("common.no"),
                    },
                    {
                      label: t("fields.riydaCardExpiry"),
                      value: formData.riydaExpiry
                        ? formData.riydaExpiry.format("YYYY-MM-DD")
                        : "",
                    },
                  ].map((f, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        label={f.label}
                        value={show(f.value)}
                        disabled
                        sx={fieldStyle}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>

          {/* ========================= CONTRACT DETAILS ========================= */}
          <Box sx={{ mb: 3 }}>
            <Box onClick={() => toggle("contract")} sx={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("section.contractInformation")}
              </Typography>

              <ExpandIcon expand={open.contract ? 1 : 0}>
                <ExpandMoreIcon />
              </ExpandIcon>
            </Box>

            <Collapse in={open.contract}>
              <Divider sx={{ my: 2 }} />

              <Box sx={rowBox}>
                <Grid container spacing={2}>
                  {[
                    {
                      label: t("fields.rentContractNumber"),
                      value: formData.rentContractNumber,
                    },
                    {
                      label: t("fields.licenseNumber"),
                      value: formData.licenseNumber,
                    },
                    {
                      label: t("fields.taxRegistrationNumber"),
                      value: formData.taxRegistrationNumber,
                    },
                    {
                      label: t("fields.beneficiaryNumber"),
                      value: formData.beneficiaryNumber,
                    },
                  ].map((f, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        label={f.label}
                        value={show(f.value)}
                        disabled
                        sx={fieldStyle}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>

          {/* ========================= CONTACT DETAILS ========================= */}
          <Box sx={{ mb: 3 }}>
            <Box onClick={() => toggle("contact")} sx={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("section.contactInformation")}
              </Typography>

              <ExpandIcon expand={open.contact ? 1 : 0}>
                <ExpandMoreIcon />
              </ExpandIcon>
            </Box>

            <Collapse in={open.contact}>
              <Divider sx={{ my: 2 }} />

              <Box sx={rowBox}>
                <Grid container spacing={2}>
                  {[
                    { label: t("fields.poBox"), value: formData.poBox },
                    { label: t("fields.postalCode"), value: formData.postalCode },
                    { label: t("fields.phone"), value: formData.phone },
                    { label: t("fields.fax"), value: formData.fax },
                  ].map((f, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        label={f.label}
                        value={show(f.value)}
                        disabled
                        sx={fieldStyle}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>

          {/* ========================= PAYMENT DETAILS ========================= */}
          <Box sx={{ mb: 3 }}>
            <Box onClick={() => toggle("payment")} sx={sectionTitleStyle}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t("step.paymentDetails")}
              </Typography>

              <ExpandIcon expand={open.payment ? 1 : 0}>
                <ExpandMoreIcon />
              </ExpandIcon>
            </Box>

            <Collapse in={open.payment}>
              <Divider sx={{ my: 2 }} />

              <Box sx={rowBox}>
                <Grid container spacing={2}>
                  {[
                    { label: t("fields.mobile"), value: formData.mobile },
                    { label: t("fields.email"), value: formData.email },
                    { label: t("fields.bankName"), value: formData.bankName },
                    { label: t("fields.accountNumber"), value: formData.accountNumber },
                    { label: t("fields.fees"), value: formData.fees },
                  ].map((f, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        label={f.label}
                        value={show(f.value)}
                        disabled
                        sx={fieldStyle}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>

          {/* ========================= PREMIUM CAPTCHA VERIFICATION ========================= */}
          <Box sx={{ mb: 4, mt: 4, pt: 4, borderTop: "3px solid #1d4a6d" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <ShieldIcon sx={{ fontSize: 40, color: "#1d4a6d" }} />
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "#1d4a6d", letterSpacing: "0.5px" }}
                >
                  Security Verification
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                  Please verify you're human to proceed
                </Typography>
              </Box>
            </Box>

            <Card
              sx={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border: "2px solid #1d4a6d",
                borderRadius: "20px",
                p: 4,
                boxShadow: "0 8px 32px rgba(29, 74, 109, 0.15)",
              }}
            >
              {/* CAPTCHA Error Alert */}
              {captchaError && (
                <Alert
                  severity="error"
                  onClose={() => setCaptchaError("")}
                  sx={{ 
                    mb: 3, 
                    borderRadius: "12px",
                    border: "1px solid #ef4444",
                    fontWeight: 600,
                  }}
                >
                  {captchaError}
                </Alert>
              )}

              {/* Success Alert */}
              {captchaVerified && (
                <Alert
                  severity="success"
                  icon={<VerifiedIcon />}
                  sx={{ 
                    mb: 3, 
                    borderRadius: "12px", 
                    backgroundColor: "#d1fae5",
                    border: "2px solid #10b981",
                    fontWeight: 700,
                    fontSize: "15px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SecurityIcon sx={{ fontSize: 20 }} />
                    CAPTCHA Verified Successfully
                  </Box>
                </Alert>
              )}

              {/* Proceed Alert */}
              {showAlert && (
                <Alert
                  severity="warning"
                  onClose={() => setShowAlert(false)}
                  sx={{ 
                    mb: 3, 
                    borderRadius: "12px",
                    border: "1px solid #f59e0b",
                    fontWeight: 600,
                  }}
                >
                  ⚠️ Please complete the CAPTCHA verification before proceeding.
                </Alert>
              )}

              <Grid container spacing={4} sx={{ alignItems: "center" }}>
                {/* CAPTCHA Canvas */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        color: "#1d4a6d",
                        fontSize: "15px",
                      }}
                    >
                      📝 Enter the text shown below:
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        "&:hover": {
                          "& .refresh-hint": {
                            opacity: 1,
                          }
                        }
                      }}
                    >
                      <canvas
                        ref={canvasRef}
                        width={350}
                        height={120}
                        style={{
                          border: "3px solid #1d4a6d",
                          borderRadius: "14px",
                          display: "block",
                          marginBottom: "16px",
                          cursor: "pointer",
                          boxShadow: "0 4px 16px rgba(29, 74, 109, 0.2)",
                          transition: "all 0.3s ease",
                        }}
                        title="Click to refresh"
                        onClick={refreshCaptcha}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 6px 20px rgba(29, 74, 109, 0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(29, 74, 109, 0.2)";
                        }}
                      />
                      <Typography
                        className="refresh-hint"
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(29, 74, 109, 0.9)",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          pointerEvents: "none",
                          fontWeight: 600,
                        }}
                      >
                        Click to refresh
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={refreshCaptcha}
                      startIcon={<span style={{ fontSize: "18px" }}>🔄</span>}
                      sx={{
                        borderColor: "#1d4a6d",
                        color: "#1d4a6d",
                        textTransform: "none",
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        borderRadius: "10px",
                        borderWidth: "2px",
                        "&:hover": {
                          borderWidth: "2px",
                          backgroundColor: "#f0f4f8",
                          borderColor: "#163a56",
                        }
                      }}
                    >
                      Refresh CAPTCHA
                    </Button>
                  </Box>
                </Grid>

                {/* Input & Verify Button */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1.5, 
                          color: "#64748b",
                        }}
                      >
                        Type the characters you see:
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter CAPTCHA here..."
                        value={userCaptchaInput}
                        onChange={(e) => setUserCaptchaInput(e.target.value.toUpperCase())}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && userCaptchaInput) {
                            verifyCaptcha();
                          }
                        }}
                        disabled={captchaVerified}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: captchaVerified ? "#d1fae5" : "#ffffff",
                            borderRadius: "12px",
                            height: "65px",
                            fontSize: "18px",
                            border: captchaVerified ? "2px solid #10b981" : "2px solid #d0d7df",
                            "&:hover": {
                              borderColor: captchaVerified ? "#10b981" : "#1d4a6d",
                            },
                            "&.Mui-focused": {
                              borderColor: captchaVerified ? "#10b981" : "#1d4a6d",
                            }
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        inputProps={{ 
                          style: { 
                            textAlign: "center", 
                            letterSpacing: "6px",
                            fontSize: "22px",
                            fontWeight: "700",
                            fontFamily: "monospace",
                          } 
                        }}
                      />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={verifyCaptcha}
                      disabled={!userCaptchaInput || captchaVerified}
                      sx={{
                        background: captchaVerified 
                          ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                          : "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                        py: 2,
                        fontWeight: 700,
                        fontSize: "16px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 16px rgba(29, 74, 109, 0.3)",
                        textTransform: "none",
                        letterSpacing: "0.5px",
                        "&:hover": { 
                          background: captchaVerified
                            ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                            : "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
                          boxShadow: "0 6px 20px rgba(29, 74, 109, 0.4)",
                        },
                        "&:disabled": { 
                          background: captchaVerified
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                          color: "#fff",
                        },
                      }}
                    >
                      {captchaVerified ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <VerifiedIcon sx={{ fontSize: "24px" }} />
                          <span>Verified Successfully</span>
                          <span style={{ fontSize: "20px" }}>✓</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <SecurityIcon sx={{ fontSize: "22px" }} />
                          <span>Verify CAPTCHA</span>
                        </Box>
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Security Badge */}
              <Box 
                sx={{ 
                  mt: 4, 
                  pt: 3, 
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <SecurityIcon sx={{ color: "#1d4a6d", fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#64748b", 
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  🔒 Your information is protected with enterprise-grade security
                </Typography>
              </Box>
            </Card>
          </Box>

        </CardContent>
      </Card>

      {/* ========================= BUTTONS ========================= */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 5, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={back}
          sx={{
            px: 6,
            py: 1.8,
            borderRadius: "14px",
            borderColor: "#1d4a6d",
            borderWidth: "2px",
            color: "#1d4a6d",
            fontWeight: 700,
            fontSize: "15px",
            textTransform: "none",
            "&:hover": {
              borderWidth: "2px",
              backgroundColor: "#f0f4f8",
            }
          }}
        >
          ← {t("buttons.back")}
        </Button>

        <Button
          variant="contained"
          onClick={handleProceed}
          disabled={!captchaVerified}
          sx={{
            px: 6,
            py: 1.8,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
            textTransform: "none",
            boxShadow: "0 4px 16px rgba(29, 74, 109, 0.3)",
            "&:hover": { 
              background: "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
              boxShadow: "0 6px 20px rgba(29, 74, 109, 0.4)",
            },
            "&:disabled": { 
              background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
              color: "#fff",
            },
          }}
        >
          {t("buttons.proceedToPay")} →
        </Button>
      </Box>
    </Box>
  );
}
