import React from "react";
// Components
import LoginModal from "../components/LoginModal";
import BasePage from "../components/BasePage";
import ErrorModal from "../components/ErrorModal";

const LoginPage = () => {
  return (
    <BasePage useContainer={true}>
      <ErrorModal />
      <LoginModal />
    </BasePage>
  );
};

export default LoginPage;
