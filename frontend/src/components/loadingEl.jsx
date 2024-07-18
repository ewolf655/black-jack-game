import React from "react";
// styling
import styled from "styled-components";

const Loading = ({ style }) => {
  return (
    <Container style={style}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Container>
  );
};

export const LoadingContainer = styled.div`
  height: 4rem;
  width: 4rem;

  margin-left: auto;
  color: ${(props) => props.theme.gold};
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1rem solid currentColor;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: currentColor transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loading;
