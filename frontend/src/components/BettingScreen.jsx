import React, { useEffect, useState, useContext, useCallback } from "react";
import Cookies from "js-cookie";
// Components
import chipsArr from "../data/chipsData";
import PokerChipColor from "../img/PokerChip";
import Loading, { LoadingContainer } from "./loadingEl";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
import BtnDeal from "./UIButtons/BtnDeal";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
// Animation
import { motion } from "framer-motion";
// Redux
import {
  calcBet
} from "../redux/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import useGame from "../hook/useGame";

const BettingScreen = ({ showBettingScreen }) => {
  const { telegramId, securityKey } = useContext(AuthContext);
  const { createNewRound } = useGame({ telegramId, securityKey });
  const [isLoading, setIsLoading] = useState(false);
  const [betArr, setBetArr] = useState([]);
  const [betTotal, setBetTotal] = useState(0);
  const [customAmount, setCustomAmount] = useState();

  const { tempBank, bank, dealerHand } = useSelector((state) => state.game);

  const { user } = useContext(AuthContext);

  const dispatch = useDispatch();

  //// FUNCTIONS
  // click a chip to push it to an array. all the values in that array will be dispatched
  const betAmount = (amount) => {
    setBetArr([...betArr, amount]);
  };

  // Clears all input fields
  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setCustomAmount(0);
  };

  const customAmountHandler = (e) => {
    e.preventDefault();

    if (customAmount > bank) {
      setCustomAmount(bank);
      if (bank > 0) setBetArr([bank]);
    } else if (customAmount < bank) {
      if (customAmount > 0) setBetArr([customAmount]);
    }
    handleReset();
  };

  const btnDealHandler = () => {
    createNewRound();
  };

  const betAllHandler = () => {
    setBetTotal(bank);
    dispatch(calcBet([bank]));
  };

  const allOutHandler = () => {
    setBetTotal(0);
    setBetArr([]);
    dispatch(calcBet([]));
  };

  // NOTE: auto updates the UI bank
  useEffect(() => {
    if (betArr.length > 0 && dealerHand.length < 1) {
      const total = betArr.reduce((acc, cur) => acc + cur);
      setBetTotal(total);
      dispatch(calcBet(betArr));
    }
  }, [dispatch, betArr, betArr.length, dealerHand.length]);

  const bettingScreenAnim = {
    initial: {
      y: -1000,
      opacity: 1,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.4,
        duration: 0.5,
        ease: [0.22, 0.01, 0.54, 1],
      },
    },
    exit: {
      y: -1000,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  };

  const backDropAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, delay: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.7, delay: 0 } },
  };

  const chipAnim = {
    hover: {
      y: -8,
      transition: {
        duration: 0.1,
      },
    },
    tap: {
      y: 2,
      transition: {
        duration: 0.1,
      },
    },
  };

  const chipsArrFiltered = chipsArr.filter((chip) => chip.value <= tempBank);

  const chipsArrStyled = chipsArrFiltered.map((chip) => {
    return (
      <StyledChipContainer
        variants={chipAnim}
        whileHover="hover"
        whileTap="tap"
        key={chip.value}
        onClick={() => betAmount(chip.value)}
      >
        {PokerChipColor(chip.color)}
        <StyledChip style={{ color: "white" }}>{chip.value}</StyledChip>
      </StyledChipContainer>
    );
  });

  return (
    <Container>
      {!dealerHand.length > 0 && (
        <>
          <StyledBackDrop
            variants={backDropAnim}
            initial="initial"
            animate="animate"
            exit="exit"
          />
          {bank < 1 && betArr.length < 1 && betTotal < 1 ? (
            <RestartScreen
              variants={bettingScreenAnim}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <p>
                Well this is awkward. . . You ran out of money 🤡 <br />
                <br />
                To play again, "borrow"
                <br />
                some money from the bank 😊
              </p>
              <StartOverBtn onClick={() => {}} disabled={isLoading}>
                GOOD IDEA!
              </StartOverBtn>
              {isLoading && (
                <LoadingContainer>
                  <Loading />
                </LoadingContainer>
              )}
            </RestartScreen>
          ) : (
            <StyledBettingScreen
              variants={bettingScreenAnim}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <StyledBank>Bank: {tempBank}</StyledBank>
              <StyledChipBox>{chipsArrStyled}</StyledChipBox>
              <StyledBetBox>
                <Form onSubmit={customAmountHandler}>
                  <FormLabel htmlFor="customAmount" style={{ display: "flex", alignItems: 'center', gap: '8px' }}>
                    <StyledSmallChipContainer
                      //   variants={chipAnim}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {PokerChipColor("white")}
					  <StyledChip style={{ color: "white" }}>{betTotal}</StyledChip>
                    </StyledSmallChipContainer>
                  </FormLabel>
                  <InputBox>
                    <CustomAmountInput
                      type="number"
                      id="customAmount"
                      placeholder="Enter Amount"
                      min="1"
                      step="1"
                      onChange={(e) => setCustomAmount(e.target.value * 1)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "." ||
                          e.key === "-" ||
                          e.key === "+" ||
                          e.key === "e"
                        )
                          e.preventDefault();
                      }}
                    />
                    <EnterBtn disabled={customAmount < 1}>
                      <FontAwesomeIcon icon={faCheck} />
                    </EnterBtn>
                  </InputBox>
                </Form>
                <BtnBox>
                  <BtnDeal
                    click={btnDealHandler}
                    betTotal={betTotal}
                    disabled={!showBettingScreen}
                  />
                  <BetBtnContainer>
                    <BetAllBtn
                      onClick={betAllHandler}
                      disabled={!showBettingScreen || betTotal === bank}
                    >
                      ALL IN!
                      <div className="btnBG1" />
                      <div className="btnBG2" />
                    </BetAllBtn>
                    <AllOutBtn
                      onClick={allOutHandler}
                      disabled={!showBettingScreen || betTotal < 1}
                    >
                      all out...
                      <div className="btnBG1" />
                      <div className="btnBG2" />
                    </AllOutBtn>
                  </BetBtnContainer>
                </BtnBox>
              </StyledBetBox>
            </StyledBettingScreen>
          )}
        </>
      )}
    </Container>
  );
};

export default BettingScreen;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  margin-bottom: 2rem;

  @media only screen and (max-width: 40em) {
    margin: 0;
    flex: 0 0 40%;
  }
`;

const EnterBtn = styled.button`
  color: ${(props) => props.theme.black};

  background-color: ${(props) => props.theme.gold};
  border-radius: 0 4px 4px 0;

  transition: all 0.3s;

  &:hover {
    filter: brightness(1.5);
  }

  &:disabled {
    color: #888;
  }
`;

const InputBox = styled.div`
  display: flex;

  width: 100%;
  max-width: 30rem;
`;

const FormLabel = styled.label`
  font-weight: 400;
  font-size: 3.6rem;
`;

const CustomAmountInput = styled.input`
  font-size: 1.8rem;
  font-family: "Montserrat", sans-serif;
  color: white;

  background-color: rgba(48, 42, 37, 0.3);
  padding: 0.8rem 1rem;
  width: 100%;
  border: 4px solid ${(props) => props.theme.gold};
  border-radius: 4px 0 0 4px;
  border-right: transparent;

  transition: all 0.2s;
  outline: none;

  &::placeholder {
    color: #a59eb8;
  }

  &:focus {
    background-color: rgba(48, 42, 37, 0.9);
  }

  // removing arrows
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh;
  width: 100%;
`;

const RestartScreen = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  position: absolute;
  z-index: 150;
  overflow: hidden;

  background-color: rgba(24, 20, 16, 0.6);
  max-height: 60rem;
  height: 100%;
  max-width: 100rem;
  width: 100%;
  border: 1px solid #979075;
  border-radius: 4px;
  padding: 2rem;

  @media only screen and (max-width: 64.12em) {
    top: 0;
    max-height: 92vh;
    max-width: 95%;
  }

  p {
    font-size: 2.4rem;
    margin-bottom: 2rem;
  }
  & > div:last-child {
    margin-left: 0;
    margin-top: 4rem;
  }
`;

const StartOverBtn = styled(motion.button)`
  font-weight: 600;
  background-color: transparent;
  border: 3px solid #ffffff83;

  transition: all 0.2s;
  &:hover {
    transform: translateY(-7px);
    background-color: rgb(0, 180, 105);
    border: 3px solid transparent;
  }
  &:active {
    transform: translateY(2px);
    background-color: rgb(0, 180, 105);
    border: 3px solid transparent;
  }
`;

const BetBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BetAllBtn = styled(motion.button)`
  position: relative;

  padding: 0.5rem 1.5rem;
  border-radius: 10rem;
  background-color: transparent;

  border: 4px solid ${(props) => props.theme.gold};
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.3);
  overflow: hidden;

  transition: all 0.3s;

  &:disabled {
    color: #ccc;
    background-color: rgba(68, 68, 68, 0.39);
    border-color: #ccc;
  }

  &:not(:disabled):hover {
    transform: translateY(-5px);
    box-shadow: 0 1.5rem 2rem rgba(0, 0, 0, 0.3);
    color: black;
    filter: brightness(115%);

    .btnBG1 {
      transform: skew(0.6rad) translateX(4rem) scale(2);
    }

    .btnBG2 {
      transform: skew(0.6rad) translateX(4rem) scale(2);
    }
  }

  &:active {
    filter: brightness(80%) hue-rotate(-10deg);
    transform: translateY(2px);
  }

  .btnBG1 {
    position: absolute;
    width: 120%;
    height: 100%;
    top: 0;
    left: -5rem;
    background: rgba(255, 174, 0, 0.664);
    z-index: -1;

    transform: skew(0.6rad) translateX(-17rem);

    transition: all 0.6s;
  }

  .btnBG2 {
    position: absolute;
    width: 120%;
    height: 100%;
    top: 0;
    left: -5rem;
    background: ${(props) => props.theme.gold};
    z-index: -1;

    transform: skew(0.6rad) translateX(-30rem);

    transition: all 0.6s;
  }
`;

const AllOutBtn = styled(BetAllBtn)``;

const StyledChipContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 9rem;
  width: 9rem;
  font-size: 3rem;
  position: relative;

  @media only screen and (max-width: 64.12em) {
    height: 13rem;
    width: 13rem;
    font-size: 4rem;
  }

  @media only screen and (max-width: 50em) {
    height: 11.3rem;
    width: 11.3rem;
    font-size: 3.5rem;
  }

  @media only screen and (max-width: 44.25em) {
    height: 10rem;
    width: 10rem;
    font-size: 3rem;
  }

  @media only screen and (max-width: 34em) {
    height: 10rem;
    width: 10rem;
    font-size: 3rem;
  }
  @media only screen and (max-width: 21em) {
    height: 9rem;
    width: 9rem;
    font-size: 3rem;
  }

  svg {
    filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.669));
  }
`;

const StyledSmallChipContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
  width: 8rem;
  position: relative;

  @media only screen and (max-width: 64.12em) {
    height: 9.6rem;
    width: 9.6rem;
  }

  @media only screen and (max-width: 50em) {
    height: 8.8rem;
    width: 8.8rem;
  }

  @media only screen and (max-width: 44.25em) {
    height: 7.2rem;
    width: 7.2rem;
  }

  @media only screen and (max-width: 34em) {
    height: 7.2rem;
    width: 7.2rem;
  }
  @media only screen and (max-width: 21em) {
    height: 6.4rem;
    width: 6.4rem;
  }

  svg {
    filter: drop-shadow(0 0.5rem 1rem rgba(0, 0, 0, 0.669));
  }
`;

const StyledChip = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  height: 10rem;
  width: 10rem;
  font-weight: 600;

  filter: drop-shadow(0 0 0.4rem rgb(0, 0, 0));
`;

const StyledChipBox = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex: 1;
  height: 100%;
  width: 100%;

  margin-right: 2rem;
  border-radius: 4px;
  background-color: rgba(145, 145, 145, 0.192);
  padding: 1rem;

  flex-wrap: wrap;
  gap: 1.5rem;

  @media only screen and (max-width: 40em) {
    margin-right: 0rem;
  }
`;

const StyledBetBox = styled(motion.div)`
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50rem;
  clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 85%);
  padding: 1rem;

  font-size: 1.6rem;
  background-color: rgba(119, 103, 85, 0.349);
  border-radius: 4px;

  @media only screen and (max-width: 40em) {
    flex-direction: row;
    justify-content: space-evenly;
    padding: 0;

    width: 100%;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
`;

const BtnBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledBank = styled(motion.div)`
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 3rem;
  font-weight: 600;
  padding: 0.2rem 1rem 0.2rem 3rem;
  color: #775100;

  z-index: 10;

  background-color: #f2ce30;
  clip-path: polygon(2.5rem 0, 110% 0, 110% 110%, 0% 100%);
`;

const StyledBettingScreen = styled(motion.div)`
  display: flex;
  align-items: center;

  background-color: rgba(139, 128, 105, 0.2);
  max-height: 60rem;
  height: 100%;
  max-width: 100rem;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #f2ce30;
  padding: 2rem;

  position: absolute;
  z-index: 150;

  @media only screen and (max-width: 64.12em) {
    top: 0;
    max-height: 92vh;
    max-width: 95%;
    border-radius: 0px;
    border: 1px solid #f2ce30;
  }

  @media only screen and (max-width: 40em) {
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const StyledBackDrop = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.4);
  height: 100%;
  width: 100%;
  backdrop-filter: blur(3px);

  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
`;
