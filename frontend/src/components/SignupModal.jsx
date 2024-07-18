/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
// Components
import Modal from "./Modal";
import Loading, { LoadingContainer } from "./loadingEl";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
// Util
import { colorChecker } from "../util";
// Routing
import { Link } from "react-router-dom";
import useUser from "../hook/useUser";

const SignupModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { user, signup, setError } = useContext(AuthContext);
  useUser(user !== undefined);

  // Form inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [color, setColor] = useState("#ffffff");

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== passwordConfirm) {
      setIsLoading(false);
      return setError("Please make sure both passwords are the same");
    }

    await signup(email, password, username, color);

    setIsLoading(false);
  };

  const colorInputHandler = (e) => {
    const hex = e.target.value;

    if (colorChecker(hex)) {
      setColor(hex);
    } else {
      e.target.value = color;
      setColor(color);
    }
  };

  return (
    <Modal useContainer={true}>
      <h1>
        <FontAwesomeIcon icon={faUserPlus} />
        Signup
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
      </h1>
      <Form onSubmit={submitHandler}>
        <InputBox>
          <FormLabel htmlFor="username" style={{ color }}>
            username
          </FormLabel>
          <FormField
            type="text"
            id="username"
            placeholder="John Doe"
            required
            onChange={(e) => setUsername(e.target.value)}
            style={{ color }}
          />
        </InputBox>

        <InputBox>
          <FormLabel htmlFor="email">email</FormLabel>
          <FormField
            type="email"
            id="email"
            placeholder="johndoe@email.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputBox>

        <InputBoxColor>
          <FormLabel htmlFor="color" className="color-label">
            color
          </FormLabel>
          <FormField
            type="color"
            id="color"
            defaultValue="#ffffff"
            onChange={colorInputHandler}
            className="color-input"
          />
          <p>
            <span>*</span> Don't use a dark color!
          </p>
        </InputBoxColor>

        <InputBox>
          <FormLabel htmlFor="password">password</FormLabel>
          <FormField
            type="password"
            id="password"
            placeholder="SecuredPassword123"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputBox>

        <InputBox>
          <FormLabel htmlFor="passwordConfirm">confirm password</FormLabel>
          <FormField
            type="password"
            id="passwordConfirm"
            placeholder="SecuredPassword123"
            required
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </InputBox>

        <SubmitBtn type="submit">Sign Up</SubmitBtn>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Modal>
  );
};

const InputBoxColor = styled.div`
  display: flex;
  align-items: center;

  gap: 2rem;

  .color-input {
    width: 10rem;
    padding: 0 !important;
    border: none !important;
  }

  p {
    font-size: 1.2rem;
    span {
      color: #ff004c;
    }
  }
`;

const SubmitBtn = styled.button`
  color: ${(props) => props.theme.black};
  background-color: ${(props) => props.theme.gold};
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

export default SignupModal;
