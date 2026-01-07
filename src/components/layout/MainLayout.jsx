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
  topSection,
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: BASE,
        direction: isRTL ? "rtl" : "ltr",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: "150px",
          background: BASE,
          borderBottom: `3px solid ${alpha("#0c0c0c", 0.2)}`,
          display: "flex",
          justifyContent: "center",
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "150px !important",
            px: { xs: 3, md: 6 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={mmLogo}
              alt="Muscat Municipality Logo"
              style={{ height: "140px", width: "auto", objectFit: "contain" }}
            />

            <Typography
              sx={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#ffffff",
                whiteSpace: "nowrap",
                marginLeft: isRTL ? "8px" : "6px",
                textShadow: "0px 1px 3px rgba(0,0,0,0.25)",
              }}
            >
              {t("header.heading")}
            </Typography>
          </Box>

          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

      {/* TOP STEPPER */}
      {topSection && (
        <Box
          sx={{
            position: "fixed",
            top: "180px",
            left: 0,
            right: 0,
            zIndex: 1100,
            background: BASE,
            px: { xs: 2, md: 6 },
            py: 0.5,
            minHeight: "90px",
          }}
        >
          {topSection}
        </Box>
      )}

      {/* MAIN SCREEN */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          mt: "380px",
          mb: "150px",
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <Box
          sx={{
            width: "500px",
            marginLeft: "65px",
            position: "fixed",
            left: 0,
            top: "380px",
            bottom: "150px",
            overflowY: "auto",
            px: { xs: 2, md: 4 },
            zIndex: 1000,
          }}
        >
          <Card
            sx={{
              background: "#fff",
              borderRadius: "18px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              minHeight: "550px",
              border: `1px solid ${alpha("#1d4a6d", 0.2)}`,
              padding: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1d4a6d",
                mb: 3,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {t("step.registrationProgress")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[ 
                { step: 0, label: t("step.companyDetails") },
                { step: 1, label: t("step.contractDetails") },
                { step: 2, label: t("step.paymentDetails") },
                { step: 3, label: t("step.summary") },
                { step: 4, label: t("step.finish") },
              ].map((item) => {
                const isActive = item.step === activeStep;
                const isCompleted = completedSteps.includes(item.step);

                const isClickable =
                  typeof onStepClick === "function" &&
                  (isCompleted || item.step <= activeStep);

                return (
                  <Box
                    key={item.step}
                    onClick={() => isClickable && onStepClick(item.step)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: "24px 18px",
                      borderRadius: "14px",
                      background: isActive
                        ? "#1d4a6d"
                        : isCompleted
                        ? alpha("#6fa571ff", 0.95)
                        : alpha("#1d4a6d", 0.5),
                      border: isActive
                        ? "3px solid #ffffff"
                        : `1px solid ${alpha("#ffffff", 0.25)}`,
                      transition: "all 0.2s ease",
                      cursor: isClickable ? "pointer" : "default",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {/* ICON / NUMBER */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fff",
                        color: isCompleted ? "#2e7d32" : "#1d4a6d",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon sx={{ fontSize: 22 }} />
                      ) : (
                        item.step + 1
                      )}
                    </Box>

                    {/* LABEL */}
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: isActive ? 700 : 500,
                        color: "#fff",
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

        {/* MAIN CONTENT */}
        <Box
          sx={{
            width: "1300px",
            marginLeft: "550px",
            overflowY: "auto",
            px: { xs: 2, md: 4 },
            pb: 3,
          }}
        >
          <Card
            sx={{
              background: "#ffffffdd",
              borderRadius: "18px",
              padding: 4,
              minHeight: "600px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.20)",
              border: `1px solid ${alpha("#000", 0.15)}`,
            }}
          >
            {children}
          </Card>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "150px",
          background: BASE,
          borderTop: `3px solid ${alpha("#000", 0.2)}`,
          display: "flex",
          alignItems: "center",
          px: 4,
          zIndex: 1100,
        }}
      >
        <img
          src={mmLogo}
          alt="Muscat Municipality Logo"
          style={{ height: "45px", width: "auto", objectFit: "contain" }}
        />

        <Typography sx={{ fontSize: "9px", fontWeight: 600, color: "#fff" }}>
          {t("footer.copyright")}
        </Typography>
      </Box>
    </Box>
  );
}
