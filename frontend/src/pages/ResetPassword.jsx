import React from "react";
// Components
import BasePage from "../components/BasePage";
import ResetPasswordModal from "../components/ResetPasswordModal";
import ErrorModal from "../components/ErrorModal";

const ResetPasswordPage = () => {
  return (
    <BasePage useContainer={true}>
      <ErrorModal />
      <ResetPasswordModal />
    </BasePage>
  );
};

export default ResetPasswordPage;
