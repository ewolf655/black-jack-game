import React from "react";
// Components
import BasePage from "../components/BasePage";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import { btnAnimation } from "../animations";
// Routing
import { Link, useLocation } from "react-router-dom";

const Error = () => {
	const location = useLocation()
  return (
    <BasePage>
      <Container>
        <p>{location.state.error}</p>
      </Container>
    </BasePage>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 8rem;
  }

  p {
    font-size: 2rem;
  }
`;

const HomeBtn = styled(motion.button)`
  font-weight: 400;
  padding: 1rem 4.2rem;
  margin-top: 2rem;
`;

export default Error;
