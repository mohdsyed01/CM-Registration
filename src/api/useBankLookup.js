// ═══════════════════════════════════════════════════════════════════════════
// OPTION 1: Create a custom hook for bank lookup (recommended)
// File: src/hooks/useBankLookup.js
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { getBankList } from "../api/lookupApi";

/**
 * Hook to get bank list and provide lookup function
 * 
 * Usage:
 *   const { bankList, getBankName, loading } = useBankLookup();
 *   const bankName = getBankName("78"); // Returns "Bank Muscat"
 */
export const useBankLookup = () => {
  const [bankList, setBankList] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  getBankList()
    .then((res) => {
      console.log("BANK LIST FROM API:", res.data);
      setBankList(res.data || []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("BANK LIST ERROR", err);
      setBankList([]);
      setLoading(false);
    });
}, []);

const getBankName = (bankCode, lang = "en") => {
  if (!bankCode) return "—";

  const code = String(bankCode).trim();

  const bank = bankList.find((b) =>
    String(
      b.bankCode ??
      b.bank_code ??
      b.BANK_CODE ??
      b.code
    ) === code
  );

  if (!bank) return code; // fallback = show code

  return lang === "ar"
    ? bank.bankNameArb ?? bank.bank_name_arb ?? bank.BANK_NAME_ARB ?? bank.nameAr
    : bank.bankNameEng ?? bank.bank_name_eng ?? bank.BANK_NAME_ENG ?? bank.name;
};


  return { bankList, getBankName, loading };
};



// ═══════════════════════════════════════════════════════════════════════════
// OPTION 2: Pass bankList as prop from parent
// In your parent component that manages the wizard:
// ═══════════════════════════════════════════════════════════════════════════

/*
// In your main wizard component:

const [bankList, setBankList] = useState([]);

useEffect(() => {
    getBankList().then(res => setBankList(res.data || []));
}, []);

// Helper function
const getBankNameByCode = (code) => {
    const bank = bankList.find(b => b.bankCode === code);
    return bank ? bank.bankNameEng : code;
};

// Pass to children:
<Step2_ContractDetails 
    formData={formData} 
    setFormData={setFormData}
    bankList={bankList}  // Pass bank list
/>

<Step3_Summary 
    formData={formData}
    getBankName={getBankNameByCode}  // Pass lookup function
/>
*/


// ═══════════════════════════════════════════════════════════════════════════
// USAGE IN SUMMARY PAGE (Step3_Summary.jsx)
// ═══════════════════════════════════════════════════════════════════════════

/*
// Option 1: Using hook
import { useBankLookup } from "../../hooks/useBankLookup";

export default function Step3_Summary({ formData }) {
    const { getBankName } = useBankLookup();
    
    return (
        <Box>
            <Typography>Bank Name: {getBankName(formData.bankCode)}</Typography>
        </Box>
    );
}

// Option 2: Using prop
export default function Step3_Summary({ formData, getBankName }) {
    return (
        <Box>
            <Typography>Bank Name: {getBankName(formData.bankCode)}</Typography>
        </Box>
    );
}
*/
