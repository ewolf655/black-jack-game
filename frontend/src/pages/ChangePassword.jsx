import React, { useContext, useState } from "react";
// Components
import BasePage from "../components/BasePage";
import Modal from "../components/Modal";
import ErrorModal from "../components/ErrorModal";
import Loading, { LoadingContainer } from "../components/loadingEl";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useUser from "../hook/useUser";

const ChangePasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const { user, setError } = useContext(AuthContext);
  useUser(user === undefined, '/login')

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== newPasswordConfirm) {
      setIsLoading(false);

      return setError(
        `"Confirm Password" is different from "New Password". Please try again`
      );
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <BasePage useContainer={true}>
      <ErrorModal />
      <Modal>
        <h1>
          <FontAwesomeIcon icon={faLock} />
          Change Password
          {isLoading && (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          )}
        </h1>
        <Form onSubmit={submitHandler}>
          <InputBox>
            <FormLabel htmlFor="currentPassword">current password</FormLabel>
            <FormField
              type="password"
              id="currentPassword"
              placeholder="OldPassword123"
              required
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </InputBox>{" "}
          <InputBox>
            <FormLabel htmlFor="newPassword">new password</FormLabel>
            <FormField
              type="password"
              id="newPassword"
              placeholder="NewPassword1234"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputBox>
          <InputBox>
            <FormLabel htmlFor="newPasswordConfirm">confirm password</FormLabel>
            <FormField
              type="password"
              id="newPasswordConfirm"
              placeholder="NewPassword1234"
              required
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </InputBox>
          <SubmitBtn type="submit" disabled={isLoading}>
            Submit
          </SubmitBtn>
        </Form>
        <p>You will need to login again after changing your password.</p>
      </Modal>
    </BasePage>
  );
};

const SubmitBtn = styled.button`
  color: ${(props) => props.theme.black};
  background-color: ${(props) => props.theme.gold};

  transition: all 0.2s;

  &:disabled {
    background-color: #999;
  }
`;

const FormField = styled.input`
  font-size: 1.8rem;
  font-family: "Montserrat", sans-serif;
  color: white;

  background-color: transparent;
  padding: 0.8rem 1rem;
  border: 1px solid #fff;
  border-radius: 4px;

  transition: border 0.5s;
  outline: none;
  &::placeholder {
    color: #a59eb8;
  }

  &:invalid {
    border: 1px solid hsl(345, 100%, 50%);
  }

  &:valid {
    border: 1px solid #00ffbf;
  }

  &:not(:focus) {
    border: 1px solid #7f7597;
  }
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: 2.2rem;

  text-transform: uppercase;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 2.8rem;
`;

export default ChangePasswordPage;
