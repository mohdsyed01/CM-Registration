/*
 * SRDetailsPage.jsx - COMPLETE RTL/LTR SUPPORT
 * 
 * Fixed Issues:
 * 1. Labels not overlapping on values (InputLabelProps: { shrink: true })
 * 2. Field values RTL-aligned
 * 3. Dialog and DialogContent RTL positioning
 * 4. Receipt RTL positioning
 * 5. Alerts RTL positioning
 * 6. Accordion sections RTL positioning with icons
 * 7. Card titles always centered
 */

import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentIcon from "@mui/icons-material/Payment";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTranslation } from "react-i18next";
import mmLogo from "../../assets/mmlogo.png";
import { useBankLookup } from "../../api/useBankLookup";
import { getReceiptBySRNumber } from "../../api/companyApi";

export default function SRDetailsPage({ srDetails, goToHome, proceedToPay }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar" || i18n.dir() === "rtl";

    useEffect(() => {
    console.group("📦 SR DETAILS FROM BACKEND");
    console.log("Raw srDetails:", srDetails);
    console.log("CR Number:", srDetails?.crNumber);
    console.log("Incident Number:", srDetails?.incidentNumber);
    console.log("Payment Required:", srDetails?.paymentRequired);
    console.log("Payment Completed:", srDetails?.paymentCompleted);
    console.log("SR Status Label:", srDetails?.srStatusLabel);
    console.log("Fees:", srDetails?.fee || srDetails?.fees);
    console.groupEnd();
}, [srDetails]);


    const [showAlert, setShowAlert] = useState(true);
    const [showReceipt, setShowReceipt] = useState(false);
    const receiptRef = useRef(null);
    const { getBankName, loading: bankLoading } = useBankLookup();

    const [receiptData, setReceiptData] = useState(null);
    const [loadingReceipt, setLoadingReceipt] = useState(false);
    const [receiptError, setReceiptError] = useState(null);

    // Accordion expanded state - all closed by default
    const [expanded, setExpanded] = useState({
        company: false,
        sme: false,
        other: false,
        bank: false,
    });

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded((prev) => ({
            ...prev,
            [panel]: isExpanded,
        }));
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowAlert(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!srDetails) return null;

    const show = (v) => (v !== null && v !== undefined && v !== "" ? String(v).trim() : "—");

    const yesNo = (v) => {
        if (v === true || v === "true" || v === 1 || v === "1" || v === "Yes" || v === "yes")
            return t("common.yes", "Yes");
        if (v === false || v === "false" || v === 0 || v === "0" || v === "No" || v === "no")
            return t("common.no", "No");
        return "—";
    };

    // Determine SR status
    const isExistingSR = srDetails.existingSR || srDetails.paymentCompleted || !srDetails.paymentRequired;
    const isPaid =
        srDetails.paymentCompleted === true ||
        srDetails.srStatusLabel === "Paid" ||
        srDetails.srStatusLabel === "Completed";
    const isPaymentPending = !isPaid;

    const encodeBase64 = (val) => (!val ? "" : btoa(String(val)));

    const handleViewReport = () => {
        if (!srDetails?.companyId) {
            alert(t("validation.apiError", "Company ID not available"));
            return;
        }
        window.open(
            `https://isupport2.mm.gov.om/TestIReportV/CompanyRegnRpt.jsp?reportParam1=${encodeBase64(srDetails.companyId)}`,
            "_blank"
        );
    };

    const fetchReceipt = async () => {
        if (!srDetails?.incidentNumber) {
            setReceiptError(t("validation.apiError", "SR Number not available"));
            return;
        }

        setLoadingReceipt(true);
        setReceiptError(null);

        try {
            const response = await getReceiptBySRNumber(srDetails.incidentNumber);
            if (response.data) {
                setReceiptData(response.data);
                setShowReceipt(true);
            } else {
                setReceiptError(t("validation.apiError", "Receipt data not available"));
            }
        } catch (error) {
            console.error("Error fetching receipt:", error);
            if (error.response?.status === 404) {
                setReceiptError(t("validation.apiError", "Receipt not found. Payment may not be completed yet."));
            } else {
                setReceiptError(t("validation.apiError", "Failed to fetch receipt. Please try again."));
            }
        } finally {
            setLoadingReceipt(false);
        }
    };

    const getLogoBase64 = () => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = () => resolve(null);
            img.src = mmLogo;
        });
    };

    const handlePrint = async () => {
        const logoBase64 = await getLogoBase64();
        const printWindow = window.open("", "_blank", "width=400,height=600");
        if (!printWindow) {
            alert(t("validation.apiError", "Please allow popups to print the receipt"));
            return;
        }
        const receiptHTML = generateReceiptHTML(logoBase64);
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 300);
        };
    };

    const handleDownloadPDF = async () => {
        const logoBase64 = await getLogoBase64();
        const printWindow = window.open("", "_blank", "width=400,height=600");
        if (!printWindow) {
            alert(t("validation.apiError", "Please allow popups to download the receipt"));
            return;
        }
        const receiptHTML = generateReceiptHTML(logoBase64);
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 300);
        };
    };

    const generateReceiptHTML = (logoBase64) => {
        const srNumber = receiptData?.incidentNumber || srDetails.incidentNumber || "—";
        const invoiceNumber = receiptData?.invoiceNumber || "—";
        const receiptNumber = receiptData?.receiptNumber || "—";
        const receiptDate = receiptData?.receiptDate || "—";
        const serviceType = receiptData?.serviceTypeName || "CM: Company Registration";
        const customerName = receiptData?.customerName || receiptData?.companyName || "—";
        const crNumber = receiptData?.crNumber || srDetails.crNumber || "—";
        const amount = receiptData?.amountPaid || srDetails.fee || srDetails.fees || "—";
        const generatedAt = receiptData?.generatedAt || new Date().toLocaleString();

        const direction = isRTL ? "rtl" : "ltr";

        return `
<!DOCTYPE html>
<html dir="${direction}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isRTL ? "إيصال" : "Receipt"} - ${srNumber}</title>
    <style>
        @page { size: 80mm auto; margin: 3mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            font-size: 11px; 
            line-height: 1.4; 
            color: #333; 
            background: #fff; 
            padding: 10px; 
            width: 100%; 
            max-width: 320px; 
            margin: 0 auto; 
            direction: ${direction}; 
        }
        .header { text-align: center; padding-bottom: 10px; border-bottom: 2px dashed #cbd5e1; margin-bottom: 10px; }
        .logo { width: 100px; height: auto; margin: 0 auto 8px auto; display: block; }
        .success-box { 
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); 
            border: 1px solid #10b981; 
            border-radius: 6px; 
            padding: 6px 10px; 
            margin: 8px 0; 
            text-align: center; 
        }
        .success-text { color: #065f46; font-weight: 700; font-size: 10px; }
        .title { 
            font-size: 12px; 
            font-weight: 800; 
            color: #1d4a6d; 
            text-align: center; 
            margin: 10px 0 6px 0; 
            letter-spacing: 0.5px; 
        }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); margin: 6px 0; }
        .row { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            padding: 5px 0; 
            border-bottom: 1px dotted #e2e8f0; 
            gap: 8px; 
        }
        .row:last-of-type { border-bottom: none; }
        .label { 
            font-size: 9px; 
            font-weight: 600; 
            color: #64748b; 
            text-transform: uppercase; 
            letter-spacing: 0.3px; 
            flex-shrink: 0; 
        }
        .value { 
            font-size: 10px; 
            font-weight: 700; 
            color: #1e293b; 
            font-family: 'Courier New', monospace; 
            word-break: break-word; 
            flex: 1; 
            text-align: ${isRTL ? "left" : "right"};
        }
        .amount-box { 
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
            border: 2px solid #1d4a6d; 
            border-radius: 8px; 
            padding: 10px 12px; 
            margin: 10px 0; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .amount-label { font-size: 10px; font-weight: 800; color: #1d4a6d; text-transform: uppercase; }
        .amount-value { font-size: 14px; font-weight: 900; color: #059669; font-family: 'Courier New', monospace; }
        .status-badge { 
            display: inline-block; 
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: #fff; 
            font-size: 8px; 
            font-weight: 700; 
            padding: 2px 6px; 
            border-radius: 10px; 
            margin-${isRTL ? "right" : "left"}: 6px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
        }
        .verified { text-align: center; padding: 6px 0; font-size: 9px; color: #059669; font-weight: 600; }
        .verified::before { content: "● "; color: #10b981; }
        .footer { text-align: center; padding-top: 10px; border-top: 2px dashed #cbd5e1; margin-top: 10px; }
        .footer-text { font-size: 8px; color: #64748b; margin: 2px 0; }
        .website { font-size: 10px; font-weight: 800; color: #1d4a6d; margin: 6px 0; }
        .timestamp { font-size: 7px; color: #94a3b8; font-style: italic; }
        @media print { 
            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; padding: 5px; } 
            .logo { width: 80px; } 
        }
    </style>
</head>
<body>
    <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Muscat Municipality" class="logo"/>` : ""}
        <div class="success-box"><span class="success-text">✓ ${isRTL ? "تم الدفع بنجاح" : "Payment Completed Successfully"}</span></div>
        <div class="title">${isRTL ? "تفاصيل المعاملة" : "Transaction Details"}</div>
        <div class="divider"></div>
    </div>
    <div class="row"><span class="label">${isRTL ? "رقم الطلب" : "SR Number"}</span><span class="value">${srNumber}</span></div>
    <div class="row"><span class="label">${isRTL ? "رقم الفاتورة" : "Invoice Number"}</span><span class="value">${invoiceNumber}</span></div>
    <div class="row"><span class="label">${isRTL ? "رقم الإيصال" : "Receipt Number"}</span><span class="value">${receiptNumber}</span></div>
    <div class="row"><span class="label">${isRTL ? "تاريخ الإيصال" : "Receipt Date"}</span><span class="value">${receiptDate}</span></div>
    <div class="row"><span class="label">${isRTL ? "نوع الخدمة" : "Service Type"}</span><span class="value">${serviceType}</span></div>
    <div class="row"><span class="label">${isRTL ? "اسم العميل" : "Customer Name"}</span><span class="value">${customerName}</span></div>
    <div class="row"><span class="label">${isRTL ? "رقم السجل التجاري" : "CR Number"}</span><span class="value">${crNumber}</span></div>
    <div class="amount-box">
        <span class="amount-label">${isRTL ? "المبلغ" : "Amount"}</span>
        <span><span class="amount-value">${isRTL ? `${amount} ر.ع` : `OMR ${amount}`}</span><span class="status-badge">${isRTL ? "مدفوع" : "Paid"}</span></span>
    </div>
    <div class="verified">${isRTL ? "تم التحقق من المعاملة" : "Transaction Verified"}</div>
    <div class="footer">
        <div class="footer-text">${isRTL ? "إيصال رسمي – بلدية مسقط" : "Official Receipt – Muscat Municipality"}</div>
        <div class="footer-text">support@mm.gov.om</div>
        <div class="website">www.mm.gov.om</div>
        <div class="timestamp">${isRTL ? "تم الإنشاء" : "Generated"}: ${generatedAt}</div>
    </div>
</body>
</html>`;
    };

    // ═══════════════════════════════════════════════════════════════
    // RTL-AWARE FIELD STYLING - FIXED LABEL OVERLAP
    // ═══════════════════════════════════════════════════════════════
    const getFieldSx = () => ({
        "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#fffef5",
            "& fieldset": { borderColor: "#e0e0e0" },
            "&:hover fieldset": { borderColor: "#bdbdbd" },
            "&.Mui-focused fieldset": { borderColor: "#1d4a6d", borderWidth: "1.5px" },
        },
        "& .MuiInputBase-input": {
            fontSize: "12px",
            padding: "8px 12px",
            textAlign: isRTL ? "right" : "left",
            direction: "ltr", // Numbers always LTR
            "&.Mui-disabled": {
                WebkitTextFillColor: "#18181b !important",
                color: "#18181b !important",
            },
        },
        "& .MuiInputLabel-root": {
            right: isRTL ? 14 : "unset",
            left: isRTL ? "unset" : 14,
            transformOrigin: isRTL ? "top right" : "top left",
            "&.MuiInputLabel-shrink": {
                transform: isRTL
                    ? "translate(-14px, -9px) scale(0.75)"
                    : "translate(14px, -9px) scale(0.75)",
            },
            background: "#fff",
            padding: "0 4px",
            color: "#1d4a6d",
            fontSize: "12px",
            fontWeight: 700,
        },
        "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e0e0e0 !important",
        },
    });

    // ═══════════════════════════════════════════════════════════════
    // RTL-AWARE ACCORDION STYLING
    // ═══════════════════════════════════════════════════════════════
    const accordionSx = {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px !important",
        mb: 1,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: "0 0 8px 0" },
    };

    const accordionSummarySx = {
        minHeight: "48px !important",
        padding: "0 16px",
        "& .MuiAccordionSummary-content": {
            margin: "12px 0 !important",
            alignItems: "center",
            gap: 1.5,
        },
        "& .MuiAccordionSummary-expandIconWrapper": {
            color: "#1d4a6d",
        },
    };

    const sectionTitleSx = {
        fontWeight: 600,
        color: "#1d4a6d",
        fontSize: "15px",
    };

    const sectionIconSx = {
        color: "#1d4a6d",
        fontSize: 22,
    };

    // ═══════════════════════════════════════════════════════════════
    // BUTTON STYLING
    // ═══════════════════════════════════════════════════════════════
    const buttonSx = { 
                        height: "40px",
                        minWidth: "auto",
                        px: 2,
                        borderRadius: "12px",
                        fontWeight: 400,
                        fontSize: "10px",
                        textTransform: "none",
                        background: "linear-gradient(135deg, #1d4a6d 0%, #0d2438 100%)",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(29, 70, 109, 0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #163a56 0%, #0a1a2a 100%)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(29, 70, 109, 0.4)",
                        },
                    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <Box sx={{ direction: isRTL ? "rtl" : "ltr" }}>
            
            {/* ═══════════════════════════════════════════════════════════════
                PAGE TITLE - ALWAYS CENTERED
            ═══════════════════════════════════════════════════════════════ */}
            <Box sx={{ 
                width: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                mt: 0.5, 
                mb: 1 
            }}>
                <Typography sx={{ 
                    fontWeight: 600, 
                    color: "#1d4a6d", 
                    fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" }, 
                    textAlign: "center",
                }}>
                    {t("step.srDetails", "SR Details")}
                </Typography>
            </Box>

            {/* ═══════════════════════════════════════════════════════════════
                CUSTOM RTL-AWARE ALERT
            ═══════════════════════════════════════════════════════════════ */}
            {showAlert && (
                <Box sx={{ mb: 1.5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            py: 1.25,
                            px: 2,
                            borderRadius: "12px",
                            backgroundColor: isPaid ? "#ecfdf5" : "#fef3cd",
                            border: `1px solid ${isPaid ? "#10b981" : "#ffc107"}`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        {/* Icon */}
                        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                            {isPaid ? (
                                <CheckCircleOutlineIcon sx={{ color: "#065f46", fontSize: 22 }} />
                            ) : (
                                <PendingActionsIcon sx={{ color: "#92400e", fontSize: 22 }} />
                            )}
                        </Box>
                        
                        {/* Message */}
                        <Typography
                            sx={{
                                flex: 1,
                                fontSize: "13px",
                                fontWeight: 600,
                                color: isPaid ? "#065f46" : "#92400e",
                                textAlign: isRTL ? "right" : "left",
                            }}
                        >
                            {isPaid ? (
                                <>
                                    {t("messages.srExistsCompleted", "SR application already exists and is completed.")}
                                    <Box component="span" sx={{ fontWeight: 800, mx: 0.5 }}>
                                        {t("fields.crNumber")}: {show(srDetails.crNumber)}
                                    </Box>
                                </>
                            ) : isExistingSR ? (
                                <>
                                    {t("messages.srExistsPending", "SR application already exists but payment is pending.")}
                                    <Box component="span" sx={{ fontWeight: 800, mx: 0.5 }}>
                                        {t("fields.crNumber")}: {show(srDetails.crNumber)}
                                    </Box>
                                </>
                            ) : (
                                <>
                                    {t("messages.srCreatedPaymentRequired", "Service Request created successfully. Payment is required.")}
                                    <Box component="span" sx={{ fontWeight: 800, mx: 0.5 }}>
                                        {t("fields.crNumber")}: {show(srDetails.crNumber)}
                                    </Box>
                                </>
                            )}
                        </Typography>
                        
                        {/* Close Button */}
                        <IconButton
                            size="small"
                            onClick={() => setShowAlert(false)}
                            sx={{
                                flexShrink: 0,
                                padding: "4px",
                                color: isPaid ? "#065f46" : "#92400e",
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                SERVICE REQUEST INFORMATION (Non-collapsible)
            ═══════════════════════════════════════════════════════════════ */}
            <Card sx={{ 
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)", 
                borderRadius: "16px", 
                mb: 1, 
                border: "1px solid #f0f0f0" 
            }}>
                <CardContent sx={{ 
                    pt: 2, 
                    px: { xs: 2, sm: 2.5, md: 3 }, 
                    pb: 2,
                    "&:last-child": { pb: 2 }
                }}>
                    {/* TITLE - ALWAYS CENTERED */}
                    <Typography sx={{ 
                        fontWeight: 600, 
                        color: "#1d4a6d", 
                        mb: 1, 
                        fontSize: "16px", 
                        textAlign: "center" 
                    }}>
                        {t("section.srInformation", "Service Request Information")}
                    </Typography>
                    
                    <Divider sx={{ mb: 2, backgroundColor: "#e8e8e8" }} />
                    
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 2.5 }, flexWrap: "wrap" }}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 140px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.srNumber", "SR Number")}
                                value={show(srDetails.incidentNumber)}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 200px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.srType", "SR Type")}
                                value={show(srDetails.srType || "CM: Company Registration")}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 110px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.srStatus", "SR Status")}
                                value={show(srDetails.srStatusLabel || (isPaid ? t("messages.paid", "Paid") : t("messages.pending", "Pending")))}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 160px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.lastUpdateDate", "Last Update Date")}
                                value={show(srDetails.lastUpdateDate || srDetails.receiptDate)}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 180px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.customerName", "Customer Name")}
                                value={show(srDetails.customerName || "Company Registration")}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 140px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.accountNumber", "Account Number")}
                                value={show(srDetails.partyAccountNumber)}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════════════
                COMPANY DETAILS (Collapsible Accordion)
            ═══════════════════════════════════════════════════════════════ */}
            <Accordion expanded={expanded.company} onChange={handleAccordionChange("company")} sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
                    <BusinessIcon sx={sectionIconSx} />
                    <Typography sx={sectionTitleSx}>
                        {t("section.companyDetails", "Company Details")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, px: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 2.5 }, flexWrap: "wrap" }}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 200px" } }}>
                            <TextField fullWidth disabled label={t("fields.companyName", "Company Name")} value={show(srDetails.companyName)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.crNumber", "CR Number")} value={show(srDetails.crNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 150px" } }}>
                            <TextField fullWidth disabled label={t("fields.occiNumber", "OCCI Number")} value={show(srDetails.occiNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 140px" } }}>
                            <TextField fullWidth disabled label={t("fields.occiIssueDate", "OCCI Issue Date")} value={show(srDetails.occiIssueDate)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 150px" } }}>
                            <TextField fullWidth disabled label={t("fields.occiExpiryDate", "OCCI Expiry Date")} value={show(srDetails.occiExpiryDate)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 100px" } }}>
                            <TextField fullWidth disabled label={t("fields.degree", "Degree")} value={show(srDetails.degreeName || srDetails.degree)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.yearsToRenew", "Years To Renew")} value={show(srDetails.yearsToRenew)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* ═══════════════════════════════════════════════════════════════
                SME & RIYADA DETAILS (Collapsible Accordion)
            ═══════════════════════════════════════════════════════════════ */}
            <Accordion expanded={expanded.sme} onChange={handleAccordionChange("sme")} sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
                    <StorefrontIcon sx={sectionIconSx} />
                    <Typography sx={sectionTitleSx}>
                        {t("section.smeRiyadaDetails", "SME & Riyada Details")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, px: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 2.5 }, flexWrap: "wrap" }}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 150px" } }}>
                            <TextField fullWidth disabled label={t("fields.isSme", "Is SME?")} value={yesNo(srDetails.isSme)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.smeType", "SME Type")} value={show(srDetails.smeType)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                            <TextField fullWidth disabled label={t("fields.isRiyadaRegistered", "Riyada Registered?")} value={yesNo(srDetails.isRiyadaRegistered)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 150px" } }}>
                            <TextField fullWidth disabled label={t("fields.riydaCardExpiry", "Riyada Expiry")} value={show(srDetails.riyadaExpiryDate)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* ═══════════════════════════════════════════════════════════════
                OTHER INFORMATION (Collapsible Accordion)
            ═══════════════════════════════════════════════════════════════ */}
            <Accordion expanded={expanded.other} onChange={handleAccordionChange("other")} sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
                    <ContactMailIcon sx={sectionIconSx} />
                    <Typography sx={sectionTitleSx}>
                        {t("section.otherInformation", "Other Information")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, px: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 2.5 }, flexWrap: "wrap" }}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 160px" } }}>
                            <TextField fullWidth disabled label={t("fields.rentContractNumber", "Rent Contract Number")} value={show(srDetails.rentContractNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 140px" } }}>
                            <TextField fullWidth disabled label={t("fields.licenseNumber", "License Number")} value={show(srDetails.licenseNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                            <TextField fullWidth disabled label={t("fields.taxRegistrationNumber", "Tax Registration")} value={show(srDetails.taxRegistrationNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 200px" } }}>
                            <TextField fullWidth disabled label={t("fields.beneficiaryNumber", "Beneficiary Number")} value={show(srDetails.beneficiaryNumber)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 100px" } }}>
                            <TextField fullWidth disabled label={t("fields.poBox", "P.O. Box")} value={show(srDetails.poBox)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.postalCode", "Postal Code")} value={show(srDetails.postalCode)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.phone", "Phone")} value={show(srDetails.phone)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.fax", "Fax")} value={show(srDetails.fax)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 130px" } }}>
                            <TextField fullWidth disabled label={t("fields.mobile", "Mobile")} value={show(srDetails.mobile)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 200px" } }}>
                            <TextField fullWidth disabled label={t("fields.email", "Email")} value={show(srDetails.email)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* ═══════════════════════════════════════════════════════════════
                BANK / PAYMENT DETAILS (Collapsible Accordion)
            ═══════════════════════════════════════════════════════════════ */}
            <Accordion expanded={expanded.bank} onChange={handleAccordionChange("bank")} sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
                    <AccountBalanceIcon sx={sectionIconSx} />
                    <Typography sx={sectionTitleSx}>
                        {t("section.bankDetails", "Bank / Payment Details")}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2, px: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{ display: "flex", gap: { xs: 2, sm: 2.5 }, flexWrap: "wrap" }}>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 170px" } }}>
                            <TextField
                                fullWidth
                                disabled
                                label={t("fields.bankName", "Bank Name")}
                                value={bankLoading ? "—" : getBankName(srDetails.bankCode ?? srDetails.bank ?? srDetails.bank_name ?? srDetails.bankName, i18n.language)}
                                InputLabelProps={{ shrink: true }}
                                sx={getFieldSx()}
                            />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 150px" } }}>
                            <TextField fullWidth disabled label={t("fields.accountNumber", "Account Number")} value={show(srDetails.bankAccountNumber || "*****")} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "0 0 100px" } }}>
                            <TextField fullWidth disabled label={t("fields.fees", "Fees")} value={show(srDetails.fee || srDetails.fees)} InputLabelProps={{ shrink: true }} sx={getFieldSx()} />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* ═══════════════════════════════════════════════════════════════
                ACTION BUTTONS
            ═══════════════════════════════════════════════════════════════ */}
            <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                gap: 2, 
                mt: 2.5, 
                mb: 1,
                flexWrap: "wrap",
            }}>
                {/* Home Button */}
                <Button variant="contained" onClick={goToHome} sx={buttonSx}>
                    <HomeIcon sx={{ fontSize: 18 }} />
                    <span>{t("buttons.home", "Home")}</span>
                </Button>

                {/* Payment Button */}
                {isPaymentPending && (
                    <Button variant="contained" onClick={proceedToPay} sx={buttonSx}>
                        <PaymentIcon sx={{ fontSize: 18 }} />
                        <span>{t("buttons.payment", "Proceed To Pay")}</span>
                    </Button>
                )}

                {/* Receipt Button */}
                {isPaid && (
                    <Button
                        variant="contained"
                        onClick={fetchReceipt}
                        disabled={loadingReceipt}
                        sx={buttonSx}
                    >
                        {loadingReceipt ? (
                            <CircularProgress size={18} sx={{ color: "#fff" }} />
                        ) : (
                            <ReceiptLongIcon sx={{ fontSize: 18 }} />
                        )}
                        <span>{loadingReceipt ? t("common.loading", "Loading...") : t("buttons.receipt", "View Receipt")}</span>
                    </Button>
                )}

                {/* Report Button */}
                {isPaid && (
                    <Button variant="contained" onClick={handleViewReport} sx={buttonSx}>
                        <DescriptionIcon sx={{ fontSize: 18 }} />
                        <span>{t("buttons.report", "View Report")}</span>
                    </Button>
                )}
            </Box>

            {/* ═══════════════════════════════════════════════════════════════
                RECEIPT ERROR ALERT
            ═══════════════════════════════════════════════════════════════ */}
            {receiptError && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            py: 1,
                            px: 2,
                            borderRadius: "12px",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            maxWidth: "500px",
                        }}
                    >
                        <WarningAmberIcon sx={{ color: "#dc2626", fontSize: 20 }} />
                        <Typography sx={{ flex: 1, fontSize: "12px", fontWeight: 600, color: "#dc2626" }}>
                            {receiptError}
                        </Typography>
                        <IconButton size="small" onClick={() => setReceiptError(null)} sx={{ color: "#dc2626" }}>
                            <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                RECEIPT DIALOG - RTL AWARE
            ═══════════════════════════════════════════════════════════════ */}
            <Dialog
                open={showReceipt}
                onClose={() => setShowReceipt(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                        maxWidth: { xs: "95%", sm: "420px" },
                        width: "100%",
                        m: { xs: 1, sm: 2 },
                        overflow: "hidden",
                        direction: isRTL ? "rtl" : "ltr",
                    },
                }}
            >
                <DialogContent sx={{ p: 0, overflow: "hidden" }}>
                    {/* Dialog Action Buttons */}
                    <Box sx={{ 
                        position: "absolute", 
                        top: 8, 
                        right: isRTL ? "unset" : 8, 
                        left: isRTL ? 8 : "unset", 
                        display: "flex", 
                        gap: 0.75, 
                        zIndex: 10 
                    }}>
                        <IconButton
                            onClick={handleDownloadPDF}
                            title={t("buttons.download", "Download PDF")}
                            size="small"
                            sx={{
                                backgroundColor: "#1d4a6d",
                                color: "#fff",
                                width: 32,
                                height: 32,
                                "&:hover": { backgroundColor: "#163a56" },
                            }}
                        >
                            <DownloadIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                            onClick={handlePrint}
                            title={t("buttons.print", "Print Receipt")}
                            size="small"
                            sx={{
                                backgroundColor: "#1d4a6d",
                                color: "#fff",
                                width: 32,
                                height: 32,
                                "&:hover": { backgroundColor: "#163a56" },
                            }}
                        >
                            <PrintIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                            onClick={() => setShowReceipt(false)}
                            title={t("buttons.close", "Close")}
                            size="small"
                            sx={{
                                backgroundColor: "#1d4a6d",
                                color: "#fff",
                                width: 32,
                                height: 32,
                                "&:hover": { backgroundColor: "#163a56" },
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    {/* Receipt Content */}
                    <Box ref={receiptRef} sx={{ p: 2.5, pt: 2, backgroundColor: "#ffffff" }}>
                        {/* Header */}
                        <Box sx={{ pb: 1.5, mb: 1.5, borderBottom: "2px dashed #e2e8f0" }}>
                            <Box sx={{ textAlign: "center", mb: 1.5, mt: 3 }}>
                                <img src={mmLogo} alt="Muscat Municipality" style={{ width: "100px", height: "auto" }} />
                            </Box>
                            <Box sx={{
                                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                                border: "1px solid #10b981",
                                borderRadius: "10px",
                                py: 1,
                                px: 2,
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                            }}>
                                <CheckCircleOutlineIcon sx={{ color: "#059669", fontSize: 18 }} />
                                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#065f46" }}>
                                    {t("messages.paymentSuccess", "Payment Completed Successfully")}
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: "15px", fontWeight: 800, color: "#1d4a6d", textAlign: "center", letterSpacing: "0.5px" }}>
                                {t("messages.transactionDetails", "Transaction Details")}
                            </Typography>
                            <Box sx={{ height: "1px", width: "40%", mx: "auto", mt: 1, background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)" }} />
                        </Box>

                        {/* Receipt Details */}
                        <Box sx={{ mb: 1.5 }}>
                            {[
                                { label: t("receipt.srNumber", "SR Number"), value: receiptData?.incidentNumber || srDetails.incidentNumber },
                                { label: t("receipt.invoiceNumber", "Invoice Number"), value: receiptData?.invoiceNumber },
                                { label: t("receipt.receiptNumber", "Receipt Number"), value: receiptData?.receiptNumber },
                                { label: t("receipt.receiptDate", "Receipt Date"), value: receiptData?.receiptDate },
                                { label: t("receipt.serviceType", "Service Type"), value: receiptData?.serviceTypeName || "CM: Company Registration" },
                                { label: t("receipt.customerName", "Customer Name"), value: receiptData?.customerName || receiptData?.companyName },
                                { label: t("receipt.crNumber", "CR Number"), value: receiptData?.crNumber || srDetails.crNumber },
                            ].map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 0.75,
                                        borderBottom: idx < 6 ? "1px dotted #e2e8f0" : "none",
                                    }}
                                >
                                    <Typography sx={{
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        color: "#64748b",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.3px",
                                    }}>
                                        {item.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        color: "#1e293b",
                                        fontFamily: "monospace",
                                        maxWidth: "180px",
                                        textAlign: isRTL ? "left" : "right",
                                    }}>
                                        {item.value || "—"}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Amount Box */}
                        <Box sx={{
                            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                            border: "2px solid #1d4a6d",
                            borderRadius: "12px",
                            py: 1.25,
                            px: 2,
                            my: 1.5,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#1d4a6d", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {t("receipt.amount", "Amount")}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#059669", fontFamily: "monospace" }}>
                                    {isRTL ? `${receiptData?.amountPaid || srDetails.fee || srDetails.fees || "—"} ر.ع` : `OMR ${receiptData?.amountPaid || srDetails.fee || srDetails.fees || "—"}`}
                                </Typography>
                                <Box sx={{
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    color: "#fff",
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    py: 0.5,
                                    px: 1.25,
                                    borderRadius: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    boxShadow: "0 2px 6px rgba(16, 185, 129, 0.4)",
                                }}>
                                    {t("messages.paid", "Paid")}
                                </Box>
                            </Box>
                        </Box>

                        {/* Verified Badge */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, py: 0.75 }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: "#10b981",
                                animation: "pulse 2s infinite",
                                "@keyframes pulse": {
                                    "0%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
                                    "70%": { boxShadow: "0 0 0 8px rgba(16, 185, 129, 0)" },
                                    "100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0)" },
                                },
                            }} />
                            <Typography sx={{ fontSize: "10px", fontWeight: 600, color: "#059669" }}>
                                {t("messages.transactionVerified", "Transaction Verified")}
                            </Typography>
                        </Box>

                        {/* Footer */}
                        <Box sx={{ textAlign: "center", pt: 1.5, borderTop: "2px dashed #e2e8f0", mt: 1 }}>
                            <Typography sx={{ fontSize: "9px", color: "#64748b", fontWeight: 500 }}>
                                {t("messages.officialReceipt", "Official Receipt – Muscat Municipality")} | support@mm.gov.om
                            </Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#1d4a6d", mt: 0.75 }}>
                                www.mm.gov.om
                            </Typography>
                            <Typography sx={{ fontSize: "8px", color: "#94a3b8", fontStyle: "italic", mt: 0.5 }}>
                                {t("receipt.generated", "Generated")}: {receiptData?.generatedAt || new Date().toLocaleString()}
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
