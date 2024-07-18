import React from "react";
// Components
import BasePage from "../components/BasePage";
import SignupModal from "../components/SignupModal";
import ErrorModal from "../components/ErrorModal";

const SignupPage = () => {
  return (
    <BasePage>
      <ErrorModal />
      <SignupModal />
    </BasePage>
  );
};

export default SignupPage;
