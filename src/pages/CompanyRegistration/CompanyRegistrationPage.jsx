import React, { useState, useMemo } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  Typography,
  Chip,
  Button,
  CardContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MainLayout from "../../components/layout/MainLayout";

import Step1_CompanyDetails from "./Step1_CompanyDetails";
import Step2_ContractDetails from "./Step2_ContractDetails";
import Step3_PaymentDetails from "./Step3_PaymentDetails";
import Step4_Summary from "./Step4_Summary";

// Step 5 component defined here
function Step5_Finish({ formData, back }) {
  const { t } = useTranslation();

  return (
    <Box>
      <Card
        sx={{
          textAlign: "center",
          padding: 4,
          backgroundColor: "#f9f9f9",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 80, color: "#1d4a6d", mb: 2 }}
          />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1d4a6d", mb: 2 }}
          >
            {t("finish.title")}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
            {t("finish.message")}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={back}
              sx={{
                borderColor: "#1d4a6d",
                color: "#1d4a6d",
                "&:hover": {
                  borderColor: "#1d4a6d",
                  backgroundColor: "rgba(29, 74, 109, 0.04)",
                },
              }}
            >
              {t("buttons.back")}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                console.log("Registration completed!", formData);
              }}
              sx={{
                backgroundColor: "#1d4a6d",
                "&:hover": {
                  backgroundColor: "#163a56",
                },
              }}
            >
              {t("finish.complete")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function CompanyRegistrationPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const steps = useMemo(
    () => [
      { label: t("step.companyDetails"), icon: "1" },
      { label: t("step.contractDetails"), icon: "2" },
      { label: t("step.paymentDetails"), icon: "3" },
      { label: t("step.summary"), icon: "4" },
      { label: t("step.finish"), icon: "5" },
    ],
    [t]
  );

  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    crNumber: "",
    companyName: "",
    mobile: "",
    email: "",
    address: "",
    ownerName: "",
    occiNumber: "",
    occiExpiry: null,
    yearsToRenew: "",
    degree: "",
    isSme: false,
    smeType: "",
    isRiyadaRegistered: false,
    riydaExpiry: null,
    rentContractNumber: "",
    licenseNumber: "",
    taxRegistrationNumber: "",
    beneficiaryNumber: "",
    poBox: "",
    postalCode: "",
    phone: "",
    fax: "",
    bankName: "",
accountNumber: "",
fees: "",

  });

  // NEW: track which steps are completed
  const [completedSteps, setCompletedSteps] = useState([]);



const next = () => {
  setCompletedSteps((prev) =>
    prev.includes(activeStep) ? prev : [...prev, activeStep]
  );
  setActiveStep((s) => (s < steps.length - 1 ? s + 1 : s));
};


  const back = () => setActiveStep((s) => (s > 0 ? s - 1 : s));

  // NEW: allow navigation via sidebar
 const goToStep = (stepIndex) => {
  if (stepIndex === activeStep) return;

  // Allow clicking only completed or previous steps
  if (stepIndex < activeStep || completedSteps.includes(stepIndex)) {
    setActiveStep(stepIndex);
  }
};


  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1_CompanyDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
          />
        );
      case 1:
        return (
          <Step2_ContractDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
            back={back}
          />
        );
      case 2:
        return (
          <Step3_PaymentDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
            back={back}
          />
        );
      case 3:
        return (
          <Step4_Summary
            formData={formData}
            next={next}
            back={back}
          />
        );
      case 4:
        return <Step5_Finish formData={formData} back={back} />;
      default:
        return null;
    }
  };

  // Custom modern stepper design (TOP – view only)
  const stepperSection = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "left",
        width: "100%",
        paddingLeft: "50px",
      }}
    >
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 3,
          padding: "10px 24px",
          minHeight: "110px",
          maxWidth: "1750px", // Adjust this value to your preference
          width: "100%",
          boxShadow: "0px 6px 30px rgba(0,0,0,0.12)",
          border: "1px solid rgba(95, 128, 128, 0.15)",
          display: "flex",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
            px: 2,
            width: "100%",
            minHeight: "90px",
            paddingTop: "10px",
          }}
        >
          {/* Background progress line */}
          <Box
            sx={{
              position: "absolute",
              top: "39px",
              left: `calc((100% / ${steps.length}) / 2)`,
              right: `calc((100% / ${steps.length}) / 2)`,
              height: "3px",
              backgroundColor: "#e8e8e8",
              borderRadius: 2,
              zIndex: 0,
            }}
          />

          {/* Active progress line */}
          <Box
            sx={{
              position: "absolute",
              top: "39px",
              left: `calc((100% / ${steps.length}) / 2)`,
              width: `calc((100% - (100% / ${steps.length})) * ${
                activeStep / (steps.length - 1)
              })`,
              height: "3px",
              backgroundColor: "#5f8080ff",
              borderRadius: 2,
              zIndex: 1,
              transition: "width 0.5s ease-in-out",
            }}
          />

          {/* Steps */}
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  zIndex: 2,
                  flex: 1,
                  minHeight: "90px",
                }}
              >
                {/* Step circle */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isActive
                      ? "#1d4a6d"
                      : isCompleted
                      ? "#1d4a6d"
                      : "#ffffff",
                    border: isActive
                      ? "3px solid #1d4a6d"
                      : isCompleted
                      ? "3px solid #1d4a6d"
                      : "3px solid #e8e8e8",
                    color: isActive || isCompleted ? "#ffffff" : "#1d4a6d",
                    fontWeight: 700,
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                    boxShadow: isActive
                      ? "0 6px 20px rgba(95, 98, 128, 0.4)"
                      : "none",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? (
                    <Box
                      component="svg"
                      sx={{ width: 24, height: 24 }}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Box>
                  ) : (
                    step.icon
                  )}

                  {/* Pulse effect */}
                  {isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        border: "2px solid #1d4a6d",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%": { transform: "scale(1)", opacity: 1 },
                          "50%": { transform: "scale(1.3)", opacity: 0 },
                          "100%": { transform: "scale(1)", opacity: 0 },
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Labels + chip */}
                <Box
                  sx={{
                    mt: 1,
                    minHeight: "50px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: isActive ? "15px" : "14px",
                      fontWeight: isActive ? 700 : isCompleted ? 600 : 400,
                      color: isActive
                        ? "#1d4a6d"
                        : isCompleted
                        ? "#1d4a6d"
                        : "#414040ff",
                      textAlign: "center",
                      maxWidth: "120px",
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    {step.label}
                  </Typography>

                  <Box sx={{ height: "22px" }}>
                    {isActive && (
                      <Chip
                        label={t("step.currentStep")}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(95, 128, 128, 0.1)",
                          color: "#1d4a6d",
                          fontSize: "11px",
                          height: "22px",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );

  return (
   <MainLayout
  topSection={stepperSection}
  activeStep={activeStep}
  completedSteps={completedSteps}
  onStepClick={goToStep}
>

      {renderStep()}
    </MainLayout>
  );
}
