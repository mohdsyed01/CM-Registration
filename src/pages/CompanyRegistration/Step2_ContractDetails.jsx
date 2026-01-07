/* FULL UPDATED FILE WITH SAME STYLING AS STEP1 AND PREMIUM BUTTONS FROM STEP3 */

import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Alert,
} from "@mui/material";

import { useTranslation } from "react-i18next";

// Date picker imports
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// THEME (same color as Step1)
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const [errors, setErrors] = useState({
    rentContractNumber: false,
    licenseNumber: false,
    taxRegistrationNumber: false,
    beneficiaryNumber: false,
    poBox: false,
    postalCode: false,
    phone: false,
    fax: false,
  });

  const [showAlert, setShowAlert] = useState(false);

  const handleBlur = (field, value) => {
    setErrors({
      ...errors,
      [field]: !value || value.trim() === "",
    });
  };

  const validateAll = () => {
    const newErrors = {
      rentContractNumber: !formData.rentContractNumber,
      licenseNumber: !formData.licenseNumber,
      taxRegistrationNumber: !formData.taxRegistrationNumber,
      beneficiaryNumber: !formData.beneficiaryNumber,
      poBox: !formData.poBox,
      postalCode: !formData.postalCode,
      phone: !formData.phone,
      fax: !formData.fax,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((x) => x);
  };

  const handleNext = () => {
    if (!validateAll()) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    next();
  };

  // -------------------------
  // SAME TEXTFIELD STYLE AS STEP1
  // -------------------------
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      height: "56px",
      transition: "0.3s",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",

      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#1d466dff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1d466dff",
        boxShadow: "0 4px 10px rgba(29,70,109,0.20)",
      },
    },

    "& .MuiInputBase-input": {
      fontSize: "14px",
      fontWeight: 500,
      padding: "16px 14px",
      textAlign: isRTL ? "right" : "left",
    },

    // LABEL (same as step1)
    "& .MuiInputLabel-root": {
      backgroundColor: "#ffffff",
      padding: "0px 6px",
      transformOrigin: isRTL ? "top right" : "top left",
      marginLeft: isRTL ? "auto" : "0",
      marginRight: isRTL ? "0" : "auto",
    },
    "& .MuiInputLabel-shrink": {
      backgroundColor: "#ffffff",
      padding: "0px 6px",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
          {/* TITLE */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 550,
                background: "linear-gradient(135deg, #1e3a8a 0%, #2e495eff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}
            >
              {t("page.contractDetails")}
            </Typography>
          </Box>

          {/* ALERT */}
          {showAlert && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "#ffebee",
                color: "#b71c1c",
                borderRadius: "12px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
              }}
            >
              {t("validation.fillAllRequired")}
            </Alert>
          )}

          {/* CONTRACT CARD */}
          <Card sx={{ mb: 3, borderRadius: "24px", boxShadow: "0px 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e3a8a", mb: 2, fontSize: "18px" }}
              >
                {t("section.contractInformation")}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Rent Contract Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.rentContractNumber")}
                    value={formData.rentContractNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rentContractNumber: e.target.value })
                    }
                    onBlur={(e) =>
                      handleBlur("rentContractNumber", e.target.value)
                    }
                    error={errors.rentContractNumber}
                    helperText={errors.rentContractNumber ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>

                {/* License Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.licenseNumber")}
                    value={formData.licenseNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, licenseNumber: e.target.value })
                    }
                    onBlur={(e) =>
                      handleBlur("licenseNumber", e.target.value)
                    }
                    error={errors.licenseNumber}
                    helperText={errors.licenseNumber ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>

                {/* Tax Registration Number */}
                <Grid item xs={12} md={6} sx={{ minWidth: "420px" }}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.taxRegistrationNumber")}
                    value={formData.taxRegistrationNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        taxRegistrationNumber: e.target.value,
                      })
                    }
                    onBlur={(e) =>
                      handleBlur("taxRegistrationNumber", e.target.value)
                    }
                    error={errors.taxRegistrationNumber}
                    helperText={
                      errors.taxRegistrationNumber ? t("validation.fieldRequired") : ""
                    }
                    sx={textFieldSx}
                  />
                </Grid>

                {/* Beneficiary Number */}
                <Grid item xs={12} md={6} sx={{ minWidth: "420px" }}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.beneficiaryNumber")}
                    value={formData.beneficiaryNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        beneficiaryNumber: e.target.value,
                      })
                    }
                    onBlur={(e) =>
                      handleBlur("beneficiaryNumber", e.target.value)
                    }
                    error={errors.beneficiaryNumber}
                    helperText={
                      errors.beneficiaryNumber ? t("validation.fieldRequired") : ""
                    }
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* CONTACT CARD */}
          <Card sx={{ mb: 5, borderRadius: "24px", boxShadow: "0px 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1e3a8a", mb: 2, fontSize: "18px" }}
              >
                {t("section.contactInformation")}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* PO Box */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.poBox")}
                    value={formData.poBox || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, poBox: e.target.value })
                    }
                    onBlur={(e) => handleBlur("poBox", e.target.value)}
                    error={errors.poBox}
                    helperText={errors.poBox ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>

                {/* Postal Code */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.postalCode")}
                    value={formData.postalCode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    onBlur={(e) => handleBlur("postalCode", e.target.value)}
                    error={errors.postalCode}
                    helperText={errors.postalCode ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.phone")}
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    onBlur={(e) => handleBlur("phone", e.target.value)}
                    error={errors.phone}
                    helperText={errors.phone ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>

                {/* Fax */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label={t("fields.fax")}
                    value={formData.fax || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fax: e.target.value })
                    }
                    onBlur={(e) => handleBlur("fax", e.target.value)}
                    error={errors.fax}
                    helperText={errors.fax ? t("validation.fieldRequired") : ""}
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ========================= PREMIUM BUTTONS (SAME AS STEP3) ========================= */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 5, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={back}
              sx={{
                px: 6,
                py: 1.8,
                borderRadius: "14px",
                borderWidth: "2px",
                borderColor: "#1d4a6d",
                color: "#1e3a8a",
                fontWeight: 700,
                fontSize: "15px",
                textTransform: "none",
                "&:hover": {
                  borderWidth: "2px",
                  borderColor: "#1e3a8a",
                  backgroundColor: "rgba(59, 130, 246, 0.05)",
                },
              }}
            >
              ← {t("buttons.back")}
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
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
            >
              {t("buttons.next")} →
            </Button>
          </Box>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
