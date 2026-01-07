// src/api/companyApi.js

import axios from "axios";

const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost:8087" 
    : "http://10.18.3.50:8087";
/**
 * Validate company (OCCI + SME + Blacklist)
 */
export const validateCompany = (payload) => {
    return axios.post(`${API_BASE}/api/company/validate`, payload);
};

/**
 * Get company details by CR number (for auto-fill)
 */
export const getCompanyByCr = (crNumber) => {
    return axios.get(`${API_BASE}/api/company/by-cr/${crNumber}`);
};

/**
 * Create or fetch SR
 */
export const createOrFetchSR = (payload) => {
    return axios.post(`${API_BASE}/api/company/register`, payload);
};

/**
 * Get SR details by CR number
 */
export const getSRDetailsByCr = (crNumber) => {
    return axios.get(`${API_BASE}/api/company/sr/${crNumber}`);
};

/**
 * Get SR details by incident ID
 */
export const getSRDetailsByIncidentId = (incidentId) => {
    return axios.get(`${API_BASE}/api/company/sr/id/${incidentId}`);
};

/**
 * Check if active SR exists for a CR number
 * Returns: { crNumber, hasActiveSR, incidentId?, incidentNumber? }
 */
export const checkExistingSR = (crNumber) => {
    return axios.get(`${API_BASE}/api/company/sr/exists/${crNumber}`);
};

/**
 * Alias for createOrFetchSR (for backward compatibility)
 * @deprecated Use createOrFetchSR instead
 */
export const createCompanySR = createOrFetchSR;

// ═══════════════════════════════════════════════════════════════════════════
// RECEIPT APIs
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get receipt details by SR Number
 */
export const getReceiptBySRNumber = (srNumber) => {
    return axios.get(`${API_BASE}/api/receipt/sr/${srNumber}`);
};

/**
 * Get receipt details by Incident ID
 */
export const getReceiptByIncidentId = (incidentId) => {
    return axios.get(`${API_BASE}/api/receipt/incident/${incidentId}`);
};

/**
 * Check if receipt is available for SR
 * (Used to enable/disable View Receipt button)
 *
 * Returns: boolean
 */
export const checkReceiptAvailable = (srNumber) => {
    return axios.get(`${API_BASE}/api/receipt/sr/${srNumber}/available`);
};
