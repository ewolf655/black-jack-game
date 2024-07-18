import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
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
import { faEdit } from "@fortawesome/free-solid-svg-icons";
// Util
import { colorChecker } from "../util";
// Config
import { API_URL } from "../config";
// Routing
import { Link } from "react-router-dom";
import useUser from "../hook/useUser";

const MePage = () => {
  const { user, setUser, setError } = useContext(AuthContext);
  useUser(user === undefined)

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [color, setColor] = useState(user?.color);

  const nameBool = newUsername === user?.username || newUsername === "";

  const formatNumber = (n) => String(n).replace(/(.)(?=(\d{3})+$)/g, "$1,");

  // Btn Handlers
  const cancelHandler = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setNewUsername("");
    setColor(user.color);
    setError(null);
  };

  const editBtnHandler = () => {
    setNewUsername("");
    setColor(user.color);
    setIsEditing(true);
  };

  const saveChangesHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
    <BasePage useContainer={true}>
      <ErrorModal />
      <Modal style={{ gap: "2rem" }}>
        <Form onSubmit={saveChangesHandler}>
          {isEditing ? (
            <>
              <IconContainer>
                {isLoading ? (
                  <LoadingContainer>
                    <Loading />
                  </LoadingContainer>
                ) : (
                  <FontAwesomeIcon icon={faEdit} />
                )}
              </IconContainer>
              <FormField
                type="text"
                id="username"
                placeholder="Enter new username"
                onChange={(e) => setNewUsername(e.target.value)}
                style={{ color: color || user.color }}
              />
              <InputBoxColor>
                <FormField
                  type="color"
                  id="color"
                  defaultValue={user.color}
                  onChange={colorInputHandler}
                  className="color-input"
                />
                <p>
                  <span>*</span> Don't use a dark color!
                </p>
              </InputBoxColor>
            </>
          ) : (
            <>
              <h1 style={{ color: user?.color }}>{user?.username}</h1>
              <p>
                Your current score is{" "}
                <span>{formatNumber(user?.currentScore)}</span>
                .
                <br />
                And your highscore is{" "}
                <span>{formatNumber(user?.highScore)}!</span>
              </p>
            </>
          )}

          <BtnContainer>
            {isEditing ? (
              <>
                <Btn
                  type="submit"
                  disabled={(color === user?.color && nameBool) || isLoading}
                >
                  Save changes
                </Btn>
                <Btn onClick={cancelHandler} type="button">
                  Cancel
                </Btn>
              </>
            ) : (
              <>
                <Btn type="button" onClick={editBtnHandler}>
                  Edit profile
                </Btn>
                <Link to="/change-password">
                  <Btn type="button">Change password</Btn>
                </Link>
              </>
            )}
          </BtnContainer>
        </Form>
      </Modal>
    </BasePage>
  );
};

const IconContainer = styled.div`
  position: absolute;
  top: 3rem;
  right: 3rem;

  font-size: 4rem;
  color: #dbccff68;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

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

const FormField = styled.input`
  display: inline-flex;
  align-items: center;
  gap: 2rem;

  font-size: 2.8rem;
  font-family: "Montserrat", sans-serif;
  background-color: transparent;
  border: none;

  transition: border 0.5s;
  outline: none;
  svg {
    font-size: 4rem;
  }

  &::placeholder {
    color: #a59eb8;
  }
`;

const Btn = styled.button`
  font-size: 1.8rem;
  font-weight: 400;

  background-color: rgba(18, 16, 24, 0.6);
  border: 1px solid #7f7597;
  border-radius: 4px;

  transition: all 0.2s;

  &:hover {
    background-color: rgba(44, 39, 59, 0.6);
  }

  &:active {
    color: #aaa;
    background-color: rgba(18, 16, 24, 0.6);
  }

  &:disabled {
    background-color: rgba(67, 66, 70, 0.4);
    border-color: #aaaaaa;
    color: #aaa;
    cursor: default;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default MePage;
