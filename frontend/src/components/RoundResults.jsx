import React from "react";
// REDUX
import { useSelector } from "react-redux";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";

const RoundResults = () => {
  const results = useSelector((state) => state.game.results);

  let text = "";

  switch (results) {
    case "push":
      text = "PUSH";
      break;
    case "bust":
      text = "BUST";
      break;
    case "dealer":
      text = "DEALER WINS";
      break;
    case "player":
      text = "YOU WIN";
      break;
    case "none":
      text = "";
      break;
    default:
      text = "err";
  }

  return (
    <>
      <StyledRoundResults>{text}</StyledRoundResults>
    </>
  );
};

const StyledRoundResults = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;

  font-size: 10rem;
  padding: 1rem 2rem;
  border: 1px solid ${(props) => props.theme.gold};
  border-radius: 8px;
  box-shadow: 0 2rem 4rem rgba(3, 0, 17, 0.404);
  z-index: 9999;

  backdrop-filter: blur(4px) brightness(140%) opacity(100%);

  @media only screen and (max-width: 22.5em) {
    font-size: 8rem;
  }
`;

export default React.memo(RoundResults);
