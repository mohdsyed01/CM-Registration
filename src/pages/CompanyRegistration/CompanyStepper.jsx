import React, { useState, useMemo } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import Step1_CompanyDetails from "./Step1_CompanyDetails";
import Step2_OtherDetails from "./Step2_OtherDetails";
import Step3_PaymentDetails from "./Step3_PaymentDetails";
import Step4_Summary from "./Step4_Summary";

export default function CompanyStepper() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

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
        return (
          <Step1_CompanyDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
          />
        );
      case 1:
        return (
          <Step2_OtherDetails
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
        return <Step4_Summary formData={formData} back={back} />;
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        width: "90%", 
        mx: "auto",
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepIcon-root.Mui-active": {
            color: "rgba(130, 121, 207, 1)",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "rgba(130, 121, 207, 0.6)",
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "rgba(130, 121, 207, 1)",
            fontWeight: "bold",
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "rgba(130, 121, 207, 0.7)",
            fontWeight: "bold",
          },
          "& .MuiStepConnector-line": {
            borderColor: "rgba(130, 121, 207, 0.4)",
          },
        }}
      >
        {steps.map((label, idx) => (
          <Step key={idx}>
            <StepLabel sx={{ textTransform: "capitalize" }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>{renderStep()}</Box>
    </Box>
  );
}