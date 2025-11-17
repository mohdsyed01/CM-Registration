import React from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    MenuItem,
    Divider,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import { searchCompany } from "../../api/companyApi";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Step1_CompanyDetails({ formData, setFormData, next }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

    const handleSearch = () => {
        searchCompany({
            crNumber: formData.crNumber,
            occiNumber: formData.occiNumber,
            occiExpiry: formData.occiExpiry,
            yearsToRenew: formData.yearsToRenew,
            degree: formData.degree,
        })
            .then((res) => {
                setFormData({ ...formData, ...res.data });
                next();
            })
            .catch(() => alert(t("messages.fetchFailed")));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    maxWidth: { xs: "100%", sm: "95%", md: 1000 },
                    mx: "auto",
                    mt: { xs: 2, md: 4 },
                    px: { xs: 2, sm: 3 },
                    direction: isRTL ? 'rtl' : 'ltr',
                }}
            >
                {/* PAGE TITLE - ALWAYS CENTER */}
            {/* PAGE TITLE - ALWAYS CENTER */}
{/* PAGE TITLE - HARD CENTERED */}
<Box
    sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
        mb: 4,
        direction: "ltr",     // isolate from RTL
    }}
>
    <Typography
        variant="h4"
        sx={{
            fontWeight: 700,
            color: "#6d6d6dff",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            textAlign: "center",
            whiteSpace: "nowrap",   // prevents shifting in RTL
        }}
    >
        {t("page.companyRegistration")}
    </Typography>
</Box>



                {/* COMPANY DETAILS CARD */}
                <Card
                    sx={{
                        boxShadow: "0px 4px 20px rgba(97, 95, 95, 0.1)",
                        borderRadius: 3,
                        mb: 2,
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#555",
                                mb: 2,
                                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                textAlign: isRTL ? "right" : "left",
                            }}
                        >
                            {t("section.companyDetails")}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={10}>
                                <TextField
                                    fullWidth
                                    label={t("fields.companyName")}
                                    value={formData.companyName}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#f9f9f9",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t("fields.crNumber")}
                                    value={formData.crNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, crNumber: e.target.value })
                                    }
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* OCCI DETAILS CARD */}
                <Card
                    sx={{
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: 3,
                        mb: 2,
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#555",
                                mb: 2,
                                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                textAlign: isRTL ? "right" : "left",
                            }}
                        >
                            {t("section.occiDetails")}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label={t("fields.occiNumber")}
                                    value={formData.occiNumber || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, occiNumber: e.target.value })
                                    }
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#fff",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label={t("fields.occiExpiryDate")}
                                    value={formData.occiExpiry || null}
                                    onChange={(newValue) =>
                                        setFormData({ ...formData, occiExpiry: newValue })
                                    }
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: {
                                                sx: {
                                                    right: isRTL ? 24 : 'auto',
                                                    left: isRTL ? 'auto' : 14,
                                                    transformOrigin: isRTL ? 'top right' : 'top left',
                                                    '&.MuiInputLabel-shrink': {
                                                        right: isRTL ? 20 : 'auto',
                                                        left: isRTL ? 'auto' : 10,
                                                    }
                                                }
                                            },
                                            sx: {
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#fff",
                                                },
                                                "& .MuiInputBase-input": {
                                                    textAlign: isRTL ? 'right' : 'left',
                                                }
                                            },
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label={t("fields.yearsToRenew")}
                                    value={formData.yearsToRenew || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            yearsToRenew: e.target.value,
                                        })
                                    }
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        minWidth: "200px",
                                        width: "100%",
                                        "& .MuiSelect-select": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                >
                                    <MenuItem value={1}>{t("select.oneYear")}</MenuItem>
                                    <MenuItem value={2}>{t("select.twoYears")}</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label={t("fields.degree")}
                                    value={formData.degree || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, degree: e.target.value })
                                    }
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        minWidth: "200px",
                                        width: "100%",
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#fff",
                                        },
                                        "& .MuiSelect-select": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                >
                                    <MenuItem value="*">*</MenuItem>
                                    <MenuItem value="**">**</MenuItem>
                                    <MenuItem value="***">***</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* SME & RIYADA DETAILS CARD */}
                <Card
                    sx={{
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                        borderRadius: 3,
                        mb: 2,
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#555",
                                mb: 2,
                                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                                textAlign: isRTL ? "right" : "left",
                            }}
                        >
                            {t("section.smeRiyadaDetails")}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("fields.isSme")}
                                    value={formData.isSme ? t("common.yes") : t("common.no")}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#f9f9f9",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("fields.smeType")}
                                    value={formData.smeType || "-"}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#f9f9f9",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("fields.isRiyadaRegistered")}
                                    value={formData.isRiyadaRegistered ? t("common.yes") : t("common.no")}
                                    InputProps={{ readOnly: true }}
                                    InputLabelProps={{
                                        sx: {
                                            right: isRTL ? 24 : 'auto',
                                            left: isRTL ? 'auto' : 14,
                                            transformOrigin: isRTL ? 'top right' : 'top left',
                                            '&.MuiInputLabel-shrink': {
                                                right: isRTL ? 20 : 'auto',
                                                left: isRTL ? 'auto' : 10,
                                            }
                                        }
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "#f9f9f9",
                                        },
                                        "& .MuiInputBase-input": {
                                            textAlign: isRTL ? 'right' : 'left',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <DatePicker
                                    label={t("fields.riydaCardExpiry")}
                                    value={formData.riydaExpiry}
                                    onChange={(newVal) =>
                                        setFormData({ ...formData, riydaExpiry: newVal })
                                    }
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: {
                                                sx: {
                                                    right: isRTL ? 24 : 'auto',
                                                    left: isRTL ? 'auto' : 14,
                                                    transformOrigin: isRTL ? 'top right' : 'top left',
                                                    '&.MuiInputLabel-shrink': {
                                                        right: isRTL ? 20 : 'auto',
                                                        left: isRTL ? 'auto' : 10,
                                                    }
                                                }
                                            },
                                            sx: {
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#f9f9f9",
                                                },
                                                "& .MuiInputBase-input": {
                                                    textAlign: isRTL ? 'right' : 'left',
                                                }
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* NEXT BUTTON */}
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 4,
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            px: { xs: 4, sm: 6 },
                            py: 1.5,
                            backgroundColor: "#8279CF",
                            borderRadius: "30px",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: { xs: "16px", sm: "18px" },
                            boxShadow: "0px 4px 12px rgba(130,121,207,0.3)",
                            "&:hover": {
                                backgroundColor: "#6f66b8",
                                boxShadow: "0px 6px 16px rgba(130,121,207,0.4)",
                            },
                        }}
                        onClick={handleSearch}
                    >
                        {t("buttons.next")}
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
}
