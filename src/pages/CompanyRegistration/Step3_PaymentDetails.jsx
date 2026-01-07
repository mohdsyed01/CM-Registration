import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Divider,
  Alert,
} from "@mui/material";

import { useTranslation } from "react-i18next";

export default function Step3_PaymentDetails({
  formData,
  setFormData,
  next,
  back,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const [errors, setErrors] = useState({
    mobile: false,
    email: false,
    bankName: false,
    accountNumber: false,
    fees: false,
  });

  const [showAlert, setShowAlert] = useState(false);

  const bankList = [
    "NATIONAL BANK OF OMAN",
    "HSBC Bank Middle East Limited",
    "CITIBANK",
    "MUSCAT. AHLI BANK",
    "OMAN ARAB BANK (SAO)",
    "OMAN INTERNATIONAL BANK (S.A.O.G.)",
    "COMMERCIAL BANK OF OMAN (S.A.O.G)",
    "HABIB BANK Ltd.",
    "HABIB BANK A.G.ZURICH",
    "BANK AL AHLI AL OMANI",
    "BANK OF OMAN BAHRAIN AND KUWAIT",
    "BANK DHOFAR",
    "Bank Of Baroda",
    "Standard Chartered Bank",
    "Bank Saderat Iran",
    "Grindlays Bank",
    "Oman European Bank",
    "Oman Housing Bank",
    "Bank Milli Iran",
    "First Abu-Dhabi Bank",
    "OMAN INVESTMENT & FINANCE",
    "MAJAN BANK",
    "AL AHLI BANK",
    "Bank of Beirut",
    "Sohar Bank",
    "Bank Muscat",
    "Development Bank",
    "NIZWA BANK",
    "NATIONAL QATAR BANK",
    "MAISARA BANK",
    "ALAIZ ISLAMIC BANK",
    "ALYUSER ISLAMIC BANK",
    "Al Ahli Islamic Banking",
    "ميثاق بنك مسقط الاسلامي",
    "Meethaq Islamic Bank",
    "MUZN ISLAMIC BANKING",
    "BNP PARIBAS",
  ];

  // ✅ Initialize with default bank on component mount
  useEffect(() => {
    if (!formData.bankName) {
      setFormData({
        ...formData,
        bankName: "NATIONAL BANK OF OMAN",
      });
    }
  }, []);

  // ✅ Complete width & sizing configuration
  const textFieldSx = {
    width: "100%",
    minWidth: "150px",
    "& .MuiOutlinedInput-root": {
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      height: "56px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",

      "& fieldset": {
        borderColor: "#e0e0e0",
        width: "100%",
      },
      "&:hover fieldset": {
        borderColor: "#1d466d",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1d466d",
        boxShadow: "0 4px 12px rgba(29,70,109,0.15)",
      },
    },

    "& .MuiInputBase-input": {
      padding: "16px 14px",
      fontSize: "14px",
      fontWeight: 500,
      textAlign: isRTL ? "right" : "left",
      width: "100%",
      boxSizing: "border-box",
    },

    "& .MuiInputLabel-root": {
      backgroundColor: "#ffffff",
      padding: "0 6px",
      fontSize: "14px",
      color: "#1d4a6d !important",
      transformOrigin: isRTL ? "top right" : "top left",
      marginLeft: isRTL ? "auto" : "0",
      transition: "color 0.2s ease, background-color 0.2s ease",
      maxWidth: "100%",
    },

    "& .MuiInputLabel-shrink": {
      backgroundColor: "#ffffff",
      padding: "0 6px",
      color: "#1d4a6d !important",
      maxWidth: "133%",
    },

    "& .MuiSelect-select": {
      width: "100%",
      boxSizing: "border-box",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      width: "100%",
    },
  };

  const handleBlur = (field, value) => {
    setErrors({
      ...errors,
      [field]: !value || value.trim() === "",
    });
  };

  const validateAllFields = () => {
    const newErrors = {
      mobile: !formData.mobile,
      email: !formData.email,
      bankName: !formData.bankName,
      accountNumber: !formData.accountNumber,
      fees: !formData.fees,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleNext = () => {
    if (!validateAllFields()) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    next();
  };

  return (
    <Box sx={{ direction: isRTL ? "rtl" : "ltr", width: "100%" }}>
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
          {t("page.paymentDetails")}
        </Typography>
      </Box>

      {/* ALERT */}
      {showAlert && (
        <Alert
          severity="error"
          onClose={() => setShowAlert(false)}
          sx={{
            mb: 3,
            borderRadius: "12px",
            background: "#ffebee",
            color: "#b71c1c",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
          }}
        >
          {t("validation.fillAllRequired")}
        </Alert>
      )}

      {/* CARD */}
      <Card
        sx={{
          borderRadius: "24px",
          boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid #e5e7eb",
          width: "100%",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 4 }, width: "100%" }}>
          <Typography
            variant="h6"
            sx={{ 
              fontWeight: 700, 
              color: "#1e3a8a", 
              mb: 2,
              fontSize: "18px",
            }}
          >
            {t("section.paymentInformation")}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* ===================================
              FORM LAYOUT - 2 ROWS:
              Row 1: Bank Name + Account Number (SIDE BY SIDE)
              Row 2: Fee + Mobile Number + Email (SIDE BY SIDE)
              =================================== */}

          {/* ========== ROW 1: BANK NAME + ACCOUNT NUMBER ========== */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 3,
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* Bank Name */}
            <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
              <TextField
                fullWidth
                select
                required
                label={t("fields.bankName")}
                placeholder="Select Bank"
                sx={textFieldSx}
                value={formData.bankName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                onBlur={(e) => handleBlur("bankName", e.target.value)}
                error={errors.bankName}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 280,
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        mt: 1,
                        "& .MuiList-root": {
                          padding: "4px 0",
                        },
                        "& .MuiMenuItem-root": {
                          fontSize: "13px",
                          padding: "6px 16px",
                          minHeight: "36px",
                          "&:hover": {
                            backgroundColor: "rgba(29,70,109,0.08)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(29,70,109,0.12)",
                            fontWeight: 500,
                            "&:hover": {
                              backgroundColor: "rgba(29,70,109,0.16)",
                            },
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {bankList.map((bank, idx) => (
                  <MenuItem key={idx} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Account Number */}
            <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "200px" }}>
              <TextField
                fullWidth
                required
                label={t("fields.accountNumber")}
                placeholder="Enter account number"
                sx={textFieldSx}
                value={formData.accountNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                onBlur={(e) => handleBlur("accountNumber", e.target.value)}
                error={errors.accountNumber}
                inputProps={{
                  style: { width: "100%" },
                }}
              />
            </Box>
          </Box>

          {/* ========== ROW 2: FEE + MOBILE + EMAIL (3 COLUMNS) ========== */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* Fees */}
            <Box sx={{ flex: "1 1 calc(33.333% - 20px)", minWidth: "150px" }}>
              <TextField
                fullWidth
                required
                label={t("fields.fees")}
                placeholder="Enter fees"
                sx={textFieldSx}
                value={formData.fees || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fees: e.target.value })
                }
                onBlur={(e) => handleBlur("fees", e.target.value)}
                error={errors.fees}
                inputProps={{
                  style: { width: "100%" },
                }}
              />
            </Box>

            {/* Mobile Number */}
            <Box sx={{ flex: "1 1 calc(33.333% - 20px)", minWidth: "150px" }}>
              <TextField
                fullWidth
                required
                label={t("fields.mobile")}
                placeholder="9x xxx xxxx"
                sx={textFieldSx}
                value={formData.mobile || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                onBlur={(e) => handleBlur("mobile", e.target.value)}
                error={errors.mobile}
                inputProps={{
                  style: { width: "100%" },
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ flex: "1 1 calc(33.333% - 20px)", minWidth: "150px" }}>
              <TextField
                fullWidth
                required
                label={t("fields.email")}
                placeholder="email@example.com"
                sx={textFieldSx}
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={(e) => handleBlur("email", e.target.value)}
                error={errors.email}
                inputProps={{
                  style: { width: "100%" },
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ========================= PREMIUM BUTTONS ========================= */}
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
  );
}
