import React, { useState, useEffect, useMemo, useContext } from "react";
// Components
import Board from "../components/Board";
import BettingScreen from "../components/BettingScreen";
import BtnHelp from "../components/UIButtons/BtnHelp";
import BasePage from "../components/BasePage";
import GoBackBtn from "../components/UIButtons/BtnGoBack";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getLastSave, setCardShuffledBoolFalse } from "../redux/gameSlice";
// Styling
import styled from "styled-components";
// Animation
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "../config";
import AuthContext from "../AuthContext";

const gaminPageAnimation = {
  initial: {
    x: 1300,
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const messageAnim = {
  initial: {
    y: -60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      ease: "easeInOut",
    },
  },
};

function Gamin() {
  const setShowBettingScreen = () => {};
  const { cardsShuffled, deckOfCards } = useSelector((state) => state.game);
  const showBettingScreen = useMemo(
    () => (deckOfCards.length === 0 ? true : false),
    [deckOfCards.length]
  );

  const {telegramId, securityKey} = useContext(AuthContext)

  const dispatch = useDispatch();

  useEffect(() => {
    if (cardsShuffled) {
      setTimeout(() => {
        dispatch(setCardShuffledBoolFalse());
      }, 3000);
    }

    return () => {};
  }, [dispatch, cardsShuffled]);

  useEffect(() => {
    let ac = new AbortController();

    if (telegramId && securityKey) {
      axios
        .get(
          `${API_URL}/round/chip?telegramId=${telegramId}&key=${securityKey}`
        )
        .then((r) => {
          if (ac.signal.aborted === false && r.data.status === true) {
            dispatch(getLastSave(r.data.chips));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    return () => ac.abort();
  }, [telegramId, securityKey, dispatch]);

  return (
    <BasePage>
      <StyledGamin
        variants={gaminPageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* <GoBackBtnContainer>
          <GoBackBtn />
        </GoBackBtnContainer> */}
        <ContainerOutOfBoundsBtns>
          <BtnHelp />
        </ContainerOutOfBoundsBtns>
        <AnimatePresence>
          <Board />
          {showBettingScreen ? (
            <BettingScreen
              key="modal"
              showBettingScreen={showBettingScreen}
            />
          ) : (
            ""
          )}
          {cardsShuffled ? (
            <Message
              variants={messageAnim}
              initial="initial"
              animate="animate"
              exit="initial"
              key="message"
            >
              🃏 The cards has been shuffled!
            </Message>
          ) : (
            ""
          )}
        </AnimatePresence>
      </StyledGamin>
    </BasePage>
  );
}

const ContainerOutOfBoundsBtns = styled(motion.div)`
  @media only screen and (max-width: 67em) {
    display: none;
  }
`;

const Message = styled(motion.div)`
  position: absolute;
  top: 2rem;
  font-size: 2rem;
  font-weight: 600;
  color: #8b4f00;

  padding: 0.5rem 1.5rem;
  background-image: ${(props) => props.theme.borderGold};
  border: 3px solid #b38300;
  border-radius: 0.4rem;
  z-index: 100;
`;

const GoBackBtnContainer = styled.div`
  @media only screen and (max-width: 67em) {
    display: none;
  }
`;

const StyledGamin = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

export default Gamin;
