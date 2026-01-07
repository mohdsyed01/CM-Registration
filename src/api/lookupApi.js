// src/api/lookupApi.js

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8087";

/**
 * Fetch bank list for dropdown
 * Returns: [{ bankCode, bankNameEng, bankNameArb }, ...]
 */
export const getBankList = () => {
    return axios.get(`${API_BASE}/api/lookup/banks`);
};

/**
 * Get bank name by code
 * Returns: { bankCode, bankNameEng }
 */
export const getBankByCode = (bankCode) => {
    return axios.get(`${API_BASE}/api/lookup/banks/${bankCode}`);
};

/**
 * Fetch degree list for dropdown
 * Returns: [{ code, name }, ...]
 */
export const getDegreeList = () => {
    return axios.get(`${API_BASE}/api/lookup/degrees`);
};

/**
 * Fetch years to renew options
 * Returns: [{ code, name }, ...]
 */
export const getYearsToRenewList = () => {
    return axios.get(`${API_BASE}/api/lookup/years`);
};
