import React from "react";
// Components
import BasePage from "../components/BasePage";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import { btnAnimation } from "../animations";
// Routing
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <BasePage>
      <Container>
        <h1>404</h1>
        <p>This page does not exist</p>
        <Link to="/">
          <HomeBtn
            variants={btnAnimation}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="active"
          >
            Return home
          </HomeBtn>
        </Link>
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

export default NotFound;
