import React from "react";
// Icons
import { ArrowIcon } from "../../img/UiBtnIcons";
// Router
import { Link } from "react-router-dom";
// Styling
import styled from "styled-components";
//Animation
import { backBtnAnim } from "../../animations";
import { motion } from "framer-motion";

const GoBackBtn = () => {
  return (
    <Link to="/">
      <StyledGoBackBtn
        variants={backBtnAnim}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="go_back--btn"
      >
        {ArrowIcon()} Home
      </StyledGoBackBtn>
    </Link>
  );
};

const StyledGoBackBtn = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.5rem 1rem;
  padding-left: 0.5rem;
  z-index: 200;

  border-radius: 4px;
  background-color: rgba(18, 16, 24, 1);
  border: 1px solid #7f7597;
  color: #7f7597;
  font-size: 1.6rem;

  transition: border 0.2s;

  &:hover {
    color: white;

    border: 1px solid white;

    svg path {
      fill: white;
    }
  }
  svg {
    height: 1.6rem;
  }
`;

export default GoBackBtn;
