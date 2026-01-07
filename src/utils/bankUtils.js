// src/utils/bankUtils.js

/**
 * Bank lookup utilities
 * Provides helper functions to convert between bank code and name
 */

// Fallback bank list (same as Step2)
export const BANK_LIST = [
    { bankCode: "51", bankNameEng: "NATIONAL BANK OF OMAN", bankNameArb: "البنك الوطني العماني" },
    { bankCode: "52", bankNameEng: "HSBC Bank Middle East Limited", bankNameArb: "بنك HSBC الشرق الأوسط" },
    { bankCode: "53", bankNameEng: "CITIBANK", bankNameArb: "سيتي بنك" },
    { bankCode: "54", bankNameEng: "MUSCAT AHLI BANK", bankNameArb: "بنك مسقط الأهلي" },
    { bankCode: "55", bankNameEng: "OMAN ARAB BANK", bankNameArb: "بنك عمان العربي" },
    { bankCode: "56", bankNameEng: "OMAN INTERNATIONAL BANK", bankNameArb: "بنك عمان الدولي" },
    { bankCode: "57", bankNameEng: "COMMERCIAL BANK OF OMAN", bankNameArb: "البنك التجاري العماني" },
    { bankCode: "58", bankNameEng: "HABIB BANK Ltd.", bankNameArb: "بنك حبيب المحدود" },
    { bankCode: "59", bankNameEng: "HABIB BANK A.G.ZURICH", bankNameArb: "بنك حبيب زيوريخ" },
    { bankCode: "60", bankNameEng: "BANK AL AHLI AL OMANI", bankNameArb: "البنك الأهلي العماني" },
    { bankCode: "61", bankNameEng: "BANK OF OMAN BAHRAIN AND KUWAIT", bankNameArb: "بنك عمان والبحرين والكويت" },
    { bankCode: "62", bankNameEng: "BANK DHOFAR", bankNameArb: "بنك ظفار" },
    { bankCode: "63", bankNameEng: "Bank Of Baroda", bankNameArb: "بنك بارودا" },
    { bankCode: "64", bankNameEng: "Standard Chartered Bank", bankNameArb: "بنك ستاندرد تشارترد" },
    { bankCode: "65", bankNameEng: "Bank Saderat Iran", bankNameArb: "بنك صادرات إيران" },
    { bankCode: "70", bankNameEng: "Oman Housing Bank", bankNameArb: "بنك الإسكان العماني" },
    { bankCode: "72", bankNameEng: "First Abu-Dhabi Bank", bankNameArb: "بنك أبوظبي الأول" },
    { bankCode: "73", bankNameEng: "OMAN INVESTMENT & FINANCE", bankNameArb: "الاستثمار والتمويل العماني" },
    { bankCode: "75", bankNameEng: "AL AHLI BANK", bankNameArb: "البنك الأهلي" },
    { bankCode: "76", bankNameEng: "Bank of Beirut", bankNameArb: "بنك بيروت" },
    { bankCode: "77", bankNameEng: "Sohar Bank", bankNameArb: "بنك صحار" },
    { bankCode: "78", bankNameEng: "Bank Muscat", bankNameArb: "بنك مسقط" },
    { bankCode: "79", bankNameEng: "Development Bank", bankNameArb: "بنك التنمية" },
    { bankCode: "80", bankNameEng: "NIZWA BANK", bankNameArb: "بنك نزوى" },
    { bankCode: "81", bankNameEng: "NATIONAL QATAR BANK", bankNameArb: "بنك قطر الوطني" },
    { bankCode: "82", bankNameEng: "MAISARA BANK", bankNameArb: "بنك ميسرة" },
    { bankCode: "83", bankNameEng: "ALIZZ ISLAMIC BANK", bankNameArb: "بنك العز الإسلامي" },
    { bankCode: "84", bankNameEng: "ALYUSR ISLAMIC BANK", bankNameArb: "بنك اليسر الإسلامي" },
    { bankCode: "85", bankNameEng: "Al Ahli Islamic Banking", bankNameArb: "الأهلي الإسلامي" },
    { bankCode: "86", bankNameEng: "Meethaq Islamic Bank", bankNameArb: "ميثاق الإسلامي" },
    { bankCode: "87", bankNameEng: "MUZN ISLAMIC BANKING", bankNameArb: "مزن الإسلامي" },
    { bankCode: "88", bankNameEng: "BNP PARIBAS", bankNameArb: "بي إن بي باريبا" },
];

/**
 * Get bank name by code
 * @param {string} bankCode - Bank code (e.g., "78")
 * @param {string} lang - Language ("en" or "ar")
 * @returns {string} Bank name or code if not found
 */
export const getBankNameByCode = (bankCode, lang = "en") => {
    if (!bankCode) return "-";
    
    const bank = BANK_LIST.find(b => b.bankCode === bankCode);
    
    if (!bank) {
        // If not found in list, return the code itself
        return bankCode;
    }
    
    return lang === "ar" ? bank.bankNameArb : bank.bankNameEng;
};

/**
 * Get bank code by name
 * @param {string} bankName - Bank name
 * @returns {string} Bank code or null if not found
 */
export const getBankCodeByName = (bankName) => {
    if (!bankName) return null;
    
    const bank = BANK_LIST.find(b => 
        b.bankNameEng.toLowerCase() === bankName.toLowerCase() ||
        b.bankNameArb === bankName
    );
    
    return bank ? bank.bankCode : null;
};

export default {
    BANK_LIST,
    getBankNameByCode,
    getBankCodeByName,
};
