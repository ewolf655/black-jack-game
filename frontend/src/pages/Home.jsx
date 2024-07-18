import React, { useContext } from "react";
// Components
import BasePage from "../components/BasePage";
import BtnSettings from "../components/UIButtons/BtnSettings";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import { btnAnimation, fadeInOut } from "../animations";
// Routing
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);

  const titleAnim = {
    initial: {
      x: -30,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  const titleTextHover = {
    y: -10,
    transition: {
      duration: 0.15,
    },
  };

  const createTitle = (title) => {
    return title.split("").map((el, i) => (
      <motion.div whileHover={titleTextHover} key={i}>
        {el}
      </motion.div>
    ));
  };

  const createLinkBtns = () => {
    const linksArr = [
      {
        link: "/login",
        label: "Login",
      },
      {
        link: "/play",
        label: user ? "Play" : "Play as guest",
      },
      {
        link: "/leaderboard",
        label: "Leaderboard",
      },
    ];
    return linksArr.map((el, i) => {
      if (user && el.label === "Login") return null;
      return (
        <Link to={el.link} key={i}>
          <Btn
            variants={btnAnimation}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="active"
          >
            {el.label}
          </Btn>
        </Link>
      );
    });
  };

  return (
    <BasePage>
      <HeaderContainer>
        <Title variants={titleAnim} initial="initial" animate="animate">
          {createTitle("BlackJack")}
        </Title>
        {user && (
          <Message
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Hello, <span style={{ color: user.color }}>{user.username}</span>
          </Message>
        )}
      </HeaderContainer>
      {createLinkBtns()}

      <BtnSettings />
    </BasePage>
  );
};

const Btn = styled(motion.button)`
  font-weight: 400;
  font-size: 2.2rem;
  min-width: 20rem;
`;

const Message = styled(motion.p)`
  font-size: 2rem;

  span {
    font-weight: 600;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  margin-bottom: 4rem;
`;

const Title = styled(motion.div)`
  display: flex;
  position: relative;
  font-size: 8rem;
  font-weight: 300;

  @media only screen and (max-width: 21.875em) {
    font-size: 7rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    height: 2px;
    background-color: #ffffff;
    animation: lineAnim 0.5s ease-out 0.6s forwards;

    @keyframes lineAnim {
      0% {
        width: 0%;
      }
      100% {
        width: 60%;
      }
    }
  }
`;

export default Home;
