import React, { useContext } from "react";
// Context
import AuthContext from "../AuthContext";
// Styles
import styled from "styled-components";

const ErrorModal = () => {
  const { error } = useContext(AuthContext);

  return (
    <>
      {error && (
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      )}
    </>
  );
};

const ErrorContainer = styled.div`
  padding: 3rem 4rem;
  width: 100%;
  max-width: 46rem;

  background-color: rgba(54, 7, 7, 0.39);
  border: 1px solid #ff0040;
  border-radius: 4px;

  p {
    font-size: 1.6rem;
  }
`;

export default ErrorModal;
