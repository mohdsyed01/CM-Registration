import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Card,
  alpha
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../buttons/LanguageSwitcher";
import mmLogo from "../../assets/mm.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function MainLayout({
  children,
  activeStep = 0,
  completedSteps = [],
  onStepClick,
}) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const BASE = "#1d4a6d";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: BASE,
        direction: isRTL ? "rtl" : "ltr",
        overflow: "hidden",
        width: "100%"
      }}
    >
      {/* ================= HEADER ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height: { xs: "64px", sm: "80px", md: "96px" },
          background: BASE,
          borderBottom: `3px solid ${alpha("#0c0c0c", 0.2)}`,
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            height: "100%",
            minHeight: { xs: "64px", sm: "80px", md: "96px" },
            px: { xs: 1.5, sm: 3, md: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5, md: 2 },
          }}
        >
          {/* LOGO */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: { xs: "40px", sm: "56px", md: "64px" },
            }}
          >
            <Box
              component="img"
              src={mmLogo}
              alt="Muscat Municipality Logo"
              sx={{
                height: "100%",
                width: "auto",
                maxWidth: { xs: "70px", sm: "100px", md: "120px" },
                objectFit: "contain",
              }}
            />
          </Box>

          {/* TITLE */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "22px", md: "28px" },
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
                textShadow: "0px 1px 3px rgba(0,0,0,0.25)",
                wordBreak: "break-word",
              }}
            >
              {t("header.heading")}
            </Typography>
          </Box>

          {/* LANGUAGE SWITCHER */}
          <Box sx={{ flexShrink: 0 }}>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= MAIN LAYOUT ================= */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 1.5, md: 2 },
          pt: { xs: 1, md: 2 },
          pb: { xs: 1.5, md: 2 },
          px: { xs: 1, sm: 2 },
          maxWidth: "1400px",
          mx: "auto",
          width: "100%",
        }}
      >
        {/* ===== SIDEBAR ===== */}
        <Box
          sx={{
            width: { xs: "100%", lg: "320px" },
            flexShrink: 0,
            position: { xs: "relative", lg: "sticky" },
            top: { xs: 0, lg: "100px" },
            zIndex: 999,
          }}
        >
          <Card
            sx={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              border: `1px solid ${alpha("#1d4a6d", 0.2)}`,
              p: { xs: 2, md: 3 },
              mb: { xs: 2, md: 4 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "18px" },
                fontWeight: 700,
                color: "#1d4a6d",
                mb: { xs: 1.5, md: 3 },
                textAlign: "center",
              }}
            >
              {t("step.registrationProgress")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, md: 2 } }}>
              {[
                { step: 0, label: t("step.companyDetails") },
                { step: 1, label: t("step.otherDetails") },
                { step: 2, label: t("step.summary") },
                { step: 3, label: t("step.srdetails") },
              ].map((item) => {
                const isActive = item.step === activeStep;
                const isCompleted = completedSteps.includes(item.step);
                const canClick =
                  typeof onStepClick === "function" &&
                  (isCompleted || item.step <= activeStep);

                return (
                  <Box
                    key={item.step}
                    onClick={() => canClick && onStepClick(item.step)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 1, md: 2 },
                      p: { xs: "10px 12px", md: "14px 14px" },
                      borderRadius: "14px",
                      background: isActive
                        ? "#1d4a6d"
                        : isCompleted
                          ? alpha("#6ead70ff", 0.95)
                          : alpha("#1d4a6d", 0.5),
                      border: isActive
                        ? "3px solid #ffffff"
                        : `1px solid ${alpha("#ffffff", 0.25)}`,
                      transition: "all 0.2s ease",
                      cursor: canClick ? "pointer" : "default",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {/* Step number */}
                    <Box
                      sx={{
                        width: { xs: 22, md: 26 },
                        height: { xs: 22, md: 26 },
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fff",
                        color: isCompleted ? "#2e7d32" : "#1d4a6d",
                        fontWeight: 700,
                        fontSize: { xs: "11px", md: "13px" },
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? <CheckCircleIcon sx={{ fontSize: { xs: 18, md: 22 } }} /> : item.step + 1}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: { xs: "11px", md: "14px" },
                        fontWeight: isActive ? 700 : 500,
                        color: "#fff",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Box>

        {/* ===== MAIN FORM ===== */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: "1000px",
          }}
        >
          <Card
            sx={{
              background: "#ffffffdd",
              borderRadius: "18px",
              p: { xs: 1.5, sm: 2, md: 2.5 },
              minHeight: "auto",
              boxShadow: "0 8px 30px rgba(0,0,0,0.20)",
              border: `1px solid ${alpha("#000", 0.15)}`,
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {children}
          </Card>
        </Box>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box
        sx={{
          background: BASE,
          borderTop: `3px solid ${alpha("#000", 0.2)}`,
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2, md: 3 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1, md: 1.5 },
          mt: "auto",
          width: "100%",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <img
          src={mmLogo}
          alt="Muscat Municipality Logo"
          style={{
            height: "auto",
            maxHeight: "36px",
            width: "auto",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "8px", sm: "9px", md: "9px" },
            fontWeight: 600,
            color: "#fff",
            textAlign: isRTL ? "right" : "left",
            whiteSpace: { xs: "normal", md: "nowrap" },
          }}
        >
          {t("footer.copyright")}
        </Typography>
      </Box>
    </Box>
  );
}