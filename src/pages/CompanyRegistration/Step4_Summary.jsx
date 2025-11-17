import React from "react";
import { Card, CardContent, Typography, Box, Button, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Step4_Summary({ formData, back }) {
  const { t } = useTranslation();

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, boxShadow: 3, borderRadius: 3 }}>
      <CardContent>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
        >
          {t("summary")}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Summary Details */}
        <Box sx={{ mb: 2 }}>
          <strong>CR Number:</strong> {formData.crNumber}
        </Box>

        <Box sx={{ mb: 2 }}>
          <strong>Company Name:</strong> {formData.companyName}
        </Box>

        <Box sx={{ mb: 2 }}>
          <strong>Mobile Number:</strong> {formData.mobile}
        </Box>

        <Box sx={{ mb: 2 }}>
          <strong>Email:</strong> {formData.email}
        </Box>

        <Box sx={{ mb: 2 }}>
          <strong>Address:</strong> {formData.address}
        </Box>

        <Box sx={{ mb: 2 }}>
          <strong>Owner Name:</strong> {formData.ownerName}
        </Box>

        {/* Back Button */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button variant="outlined" onClick={back}>
            {t("back")}
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}
