import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  CardContent,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MainLayout from "../../components/layout/MainLayout";

import Step1_CompanyDetails from "./Step1_CompanyDetails";
import Step2_ContractDetails from "./Step2_ContractDetails";
import Step4_Summary from "./Step4_Summary";
import Step5_SRDetails from "./Step5_SRDetails";

import { getSRDetailsByCr } from "../../api/companyApi";

export default function CompanyRegistrationPage() {
  const { t, i18n } = useTranslation();

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [crChecked, setCrChecked] = useState(false);

  const [isExistingSRView, setIsExistingSRView] = useState(false);
  const [srDetails, setSrDetails] = useState(null);
  const [loadingSR, setLoadingSR] = useState(false);

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
    bankCode: "",
    bankName: "",
    accountNumber: "",
    fees: "",
  });

  // ─────────────────────────────────────────────────────────────
  // STEPS
  // ─────────────────────────────────────────────────────────────
  const steps = useMemo(
    () => [
      { label: t("step.companyDetails") },
      { label: t("step.contractDetails") },
      { label: t("step.summary") },
      { label: t("step.srDetails") },
    ],
    [t]
  );

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ─────────────────────────────────────────────────────────────
  const next = () => {
    setCompletedSteps((prev) =>
      prev.includes(activeStep) ? prev : [...prev, activeStep]
    );
    setActiveStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  /**
   * 🔒 CRITICAL FIX
   * Disable ALL stepper clicks when Existing SR view is active
   */
  const goToStep = (stepIndex) => {
    if (isExistingSRView) return; // 🚫 HARD BLOCK
    if (stepIndex === activeStep) return;
    if (stepIndex < activeStep || completedSteps.includes(stepIndex)) {
      setActiveStep(stepIndex);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // EXISTING SR HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleExistingSRFound = async (srInfo) => {
    setIsExistingSRView(true);
    setCompletedSteps([]);
    setActiveStep(3);
    setLoadingSR(true);

    try {
      const response = await getSRDetailsByCr(formData.crNumber);

      if (response?.data) {
        setSrDetails({
          ...response.data,
          existingSR: true,
        });
      } else {
        alert("No SR details found");
      }
    } catch (e) {
      alert("Failed to load SR details");
    } finally {
      setLoadingSR(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RESET (ONLY WAY OUT FROM EXISTING SR VIEW)
  // ─────────────────────────────────────────────────────────────
  const resetToHome = () => {
    setIsExistingSRView(false);
    setSrDetails(null);
    setCompletedSteps([]);
    setCrChecked(false);
    setActiveStep(0);
    setFormData({
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
      bankCode: "",
      bankName: "",
      accountNumber: "",
      fees: "",
    });
  };

  // ─────────────────────────────────────────────────────────────
  // STEP RENDERER
  // ─────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1_CompanyDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
            setCrChecked={setCrChecked}
            onExistingSRFound={handleExistingSRFound}
          />
        );

      case 1:
        return (
          <Step2_ContractDetails
            formData={formData}
            setFormData={setFormData}
            next={next}
            back={back}
            crChecked={crChecked}
          />
        );

      case 2:
        return (
          <Step4_Summary
            formData={formData}
            setSrDetails={setSrDetails}
            next={next}
            back={back}
          />
        );

      case 3:
        return (
          <Step5_SRDetails
            srDetails={srDetails}
            isExistingSRView={isExistingSRView}
            goToHome={resetToHome}
          />
        );

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────────
  return (
    <MainLayout
      activeStep={activeStep}
      completedSteps={completedSteps}
      onStepClick={goToStep}
      isExistingSRView={isExistingSRView} // 🔒 used to disable stepper visuals
    >
      {renderStep()}

      <Backdrop
        open={loadingSR}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#1d4a6d", mb: 2 }} />
          <Typography sx={{ fontWeight: 600, color: "#1d4a6d" }}>
            Loading SR Details...
          </Typography>
        </Box>
      </Backdrop>
    </MainLayout>
  );
}
