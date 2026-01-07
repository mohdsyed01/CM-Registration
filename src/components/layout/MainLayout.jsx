import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Card,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../buttons/LanguageSwitcher";
import mmLogo from "../../assets/latest.png";
import mmLogoFooter from "../../assets/mm.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function MainLayout({
  children,
  activeStep = 0,
  completedSteps = [],
  onStepClick,
  isExistingSRView = false,  // ← NEW PROP
}) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const BASE = "#1d4a6d";

  // Step configuration
  const steps = [
    { step: 0, label: t("step.companyDetails") },
    { step: 1, label: t("step.otherDetails") },
    { step: 2, label: t("step.summary") },
    { step: 3, label: t("step.srDetails") },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: BASE,
        direction: isRTL ? "rtl" : "ltr",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* ================= HEADER ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height: { xs: "56px", sm: "64px", md: "72px" },
          background: BASE,
          borderBottom: `2px solid ${alpha("#0c0c0c", 0.2)}`,
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
            minHeight: { xs: "56px", sm: "64px", md: "72px" },
            px: { xs: 1.5, sm: 3, md: 4 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5, md: 2 },
          }}
        >

{/* LOGO - ZOOMED/BIGGER */}
<Box
  sx={{
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: { xs: "4px 8px", sm: "6px 12px", md: "8px 16px" },
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  }}
>
  <Box
    component="img"
    src={mmLogo}
    alt="Muscat Municipality Logo"
    sx={{
      height: { xs: "40px", sm: "45px", md: "54px" },      // Increased from 39/46/49
      width: { xs: "200px", sm: "220px", md: "280px" },    // Increased from 200/220/280
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
                fontSize: { xs: "14px", sm: "18px", md: "22px" },
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.2,
                textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
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

      {/* ================= HORIZONTAL BOX STEPPER ================= */}
      <Box
        sx={{
          background: "#fff",
          px: { xs: 1, sm: 3, md: 3 },
          py: { xs: 1.5, md: 2 },
          pb: { xs: 1, sm: 1.5, md: 1 }, // ✅ EXTRA SPACE FOR "Current Step"
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            mx: "auto",
          }}
        >
          {/* Stepper Row - All boxes aligned */}
          <Box
           sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: { xs: "flex-start", sm: "center" },

    overflowX: { xs: "auto", sm: "visible" },
    overflowY: "visible",

    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    pb: 3,

    "&::-webkit-scrollbar": {
      display: "none",
    },
  }}
          >
            {steps.map((item, index) => {
              const isActive = item.step === activeStep;

              // ═══════════════════════════════════════════════════════════════
              // KEY LOGIC: If viewing existing SR, only SR Details is active
              // All other steps are NOT completed (gray)
              // ═══════════════════════════════════════════════════════════════
              const isCompleted = isExistingSRView
                ? false  // No steps are completed when viewing existing SR
                : completedSteps.includes(item.step);

              // Can click only if:
              // - Normal flow: completed or current/previous step
              // - Existing SR view: only Step 0 (to go back and reset)
              const canClick =
                typeof onStepClick === "function" &&
                !isExistingSRView &&                    // 🔒 HARD LOCK
                (isCompleted || item.step <= activeStep);
              // Connector logic
              const showConnectorBefore = index > 0;
              const prevCompleted = isExistingSRView
                ? false
                : completedSteps.includes(index - 1);

              return (
                <React.Fragment key={item.step}>
                  {/* Connector Line */}
                  {showConnectorBefore && (
                    <Box
                      sx={{
                        flex: 1,
                        height: "3px",
                      minWidth: { xs: "10px", sm: "40px", md: "60px" },
maxWidth: { xs: "24px", sm: "80px", md: "120px" },

                        backgroundColor: prevCompleted ? "#10b981" : "#d0d0d0",
                        borderRadius: "2px",
                        transition: "all 0.25s ease",
                        opacity: isExistingSRView ? 0.6 : 1,
                        pointerEvents: isExistingSRView ? "none" : "auto",
                      }}
                    />
                  )}

                  {/* Step Box Container */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* The Box with number + label */}
                    <Box
                      onClick={() => canClick && onStepClick(item.step)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.5, md: 0.75 },
                        px: { xs: 1, sm: 1.25, md: 1.5 },
                        py: { xs: 0.5, md: 0.6 },
                        borderRadius: "8px",

                        // Background colors
                        background: isActive
                          ? "#1d4a6d"
                          : isCompleted
                            ? "#10b981"
                            : alpha("#1d4a6d", 0.5),

                        // Border
                        border: isActive
                          ? "2px solid #fff"
                          : "1px solid transparent",

                        // Shadow
                        boxShadow: isActive
                          ? "0 2px 8px rgba(29, 74, 109, 0.4)"
                          : "none",

                        transition: "all 0.2s ease",
                        cursor: canClick ? "pointer" : "default",

                        "&:hover": canClick
                          ? {
                            transform: "scale(1.02)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                          }
                          : {},
                      }}
                    >
                      {/* Step Number or Check Icon */}
                      <Box
                        sx={{
                          width: { xs: 16, md: 18 },
                          height: { xs: 16, md: 18 },
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fff",
                          color: isCompleted ? "#10b981" : "#1d4a6d",
                          fontWeight: 700,
                          fontSize: { xs: "9px", md: "10px" },
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ fontSize: { xs: 14, md: 16 } }} />
                        ) : (
                          item.step + 1
                        )}
                      </Box>

                      {/* Step Label */}
                      <Typography
                        sx={{
                          fontSize: { xs: "9px", sm: "10px", md: "11px" },
                          fontWeight: 600,
                          color: "#fff",
                          whiteSpace: { xs: "normal", sm: "nowrap" },
textAlign: "center",
maxWidth: { xs: "60px", sm: "none" },
lineHeight: 1.2,

                        }}
                      >
                        
                        {item.label}
                      </Typography>
                      
                    </Box>

                    {/* Current Step Text - Absolute positioned below */}
                    <Typography
                      sx={{
                        position: "absolute",
                        bottom: "-23px",
                        left: "50%",
                        transform: "translateX(-50%)",

                        // 👇 Visual highlight
                        backgroundColor: "#5d7485ff",
                        color: "#ffffff",
px: { xs: 0.75, sm: 1.25, md: 1.5 },
py: { xs: 0.3, md: 0.3 },


                        borderRadius: "999px",
                        fontSize: { xs: "7px", sm: "8px", md: "9px" },
                        fontWeight: 600,
                        letterSpacing: "0.3px",

                        whiteSpace: "nowrap",
                        opacity: isActive ? 1 : 0,
                        transition: "all 0.25s ease",

                        // 👇 Soft glow
                        boxShadow: "0 2px 6px rgba(29, 74, 109, 0.35)",


                      }}
                    >
                      {t("step.currentStep", "Current Step")}
                    </Typography>
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </Box>

   
{/* ================= MAIN CONTENT ================= */}
<Box
  sx={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    pt: { xs: 0.5, md: 0.75 },      // ← REDUCED from 1.5/2
    pb: { xs: 0.5, md: 0.75 },      // ← REDUCED from 1.5/2
    px: { xs: 1, sm: 2 },
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: "1200px",
    }}
  >
    <Card
      sx={{
        background: "#ffffffee",
        borderRadius: "14px",
        p: { xs: 1, sm: 1.5, md: 1.5 },   // ← REDUCED from 1.5/2/2.5
        minHeight: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        border: `1px solid ${alpha("#000", 0.1)}`,
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
          borderTop: `2px solid ${alpha("#000", 0.2)}`,
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5, md: 2 },
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 0.75, md: 1 },
          mt: "auto",
          width: "100%",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <img
          src={mmLogoFooter}
          alt="Muscat Municipality Logo"
          style={{
            height: "auto",
            maxHeight: "28px",
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