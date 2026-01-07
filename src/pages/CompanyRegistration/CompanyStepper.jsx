import React, { useState, useMemo } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import Step1_CompanyDetails from "./Step1_CompanyDetails";
import Step2_OtherDetails from "./Step2_ContractDetails";
import Step3_PaymentDetails from "./Step3_PaymentDetails";
import Step4_Summary from "./Step4_Summary";

export default function CompanyStepper() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

  const steps = useMemo(
    () => [
      t("step.companyDetails"),
      t("step.otherDetails"),
      t("step.paymentDetails"),
      t("step.summary"),
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
  });

  const next = () => setActiveStep((s) => s + 1);
  const back = () => setActiveStep((s) => s - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <Step1_CompanyDetails formData={formData} setFormData={setFormData} next={next} />;
      case 1:
        return <Step2_OtherDetails formData={formData} setFormData={setFormData} next={next} back={back} />;
      case 2:
        return <Step3_PaymentDetails formData={formData} setFormData={setFormData} next={next} back={back} />;
      case 3:
        return <Step4_Summary formData={formData} back={back} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Stepper at the top */}
      <Box sx={{ 
        width: "100%",
        direction: isRTL ? "rtl" : "ltr",
        mb: 4,
        position: "absolute",
        top: "-120px",
        left: 0,
        right: 0,
        px: 4,
        py: 0.5,           // ↓ reduce height of white card
        minHeight: "60px", // ↓ make card compact
      }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepIcon-root": { color: "#cfe4e4" },
            "& .MuiStepIcon-root.Mui-active": { color: "#5f8080ff" },
            "& .MuiStepIcon-root.Mui-completed": { color: "#5f8080aa" },
            "& .MuiStepLabel-label": {
              fontSize: "16px",
              fontWeight: 500,
              color: "#444",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "#5f8080ff",
              fontWeight: 700,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "#5f8080aa",
              fontWeight: 600,
            },
            "& .MuiStepConnector-line": {
              borderColor: "#5f808033",
              borderWidth: "2px",
            },
          }}
        >
          {steps.map((label, idx) => (
            <Step key={idx}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form content */}
      {renderStep()}
    </>
  );
}