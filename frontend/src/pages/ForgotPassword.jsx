import React from "react";
// Components
import BasePage from "../components/BasePage";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import ErrorModal from "../components/ErrorModal";

const ForgotPasswordPage = () => {
  return (
    <BasePage>
      <ErrorModal />

      <ForgotPasswordModal />
    </BasePage>
  );
};

export default ForgotPasswordPage;
