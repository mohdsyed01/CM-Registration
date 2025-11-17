import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyRegistrationPage from "../pages/CompanyRegistration/CompanyRegistrationPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route (optional) */}
        <Route path="/" element={<CompanyRegistrationPage />} />

        {/* Main page for stepper */}
        <Route
          path="/company-registration"
          element={<CompanyRegistrationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
