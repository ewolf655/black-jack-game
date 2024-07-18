import React, { useEffect, useState } from "react";
// Styling
import styled from "styled-components";
//Animation
import { motion } from "framer-motion";

const BtnHelp = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [content, setContent] = useState(null);

  //// TEXT CONTENTS
  const ContentHowToPlay = (
    <>
      <h2>Buttons and What They Do</h2>
      <p>
        <span>HIT:</span> Draw a card from the Deck.
        <br />
        <br />
        <span>STAND:</span> End your turn.
        <br />
        <br />
        <span>DOUBLE:</span> You will draw only 1 card but double your bet.
        <br />
        <br />
      </p>
    </>
    // SURRENDER: Lose this round but lose only half your money
  );

  const ContentHowToWin = (
    <>
      <h2>How to Beat the Dealer</h2>
      <p>
        <span>To win</span>, you must draw a hand value that is higher than the
        dealer's hand value.
        <br />
        <span>You win</span> if the dealer's hand value is goes over 21. <br />
        <span>You win</span> if you draw a hand of 21 on your first two cards{" "}
        <br />
        <br />
        <span>You lose</span> if your hand value exceeds 21 or if the dealer's
        hand has greater value than yours at the end of the round. <br />
        <br />
        <span>Nobody wins</span> if everyone's hand value exceeds 21 or are the
        same value.
      </p>
    </>
  );

  const ContentCardValues = (
    <>
      <h2>Card Values</h2>
      <p>
        <span>2 through 10</span> count at face value
        <br />
        <br />
        <span>Face cards</span> (J, Q, K) count as 10
        <br />
        <br />
        <span>Ace</span> can count as a 1 or an 11 depending on which value
        helps the hand the most
        <br />
      </p>
    </>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setContent(ContentHowToPlay), []);

  return (
    <StyledBtnHelp
      onClick={() => !showHelp && setShowHelp(true)}
      className="help--btn"
      style={showHelp ? "" : { width: "1.6rem", padding: "1.3rem 2rem" }}
    >
      {showHelp ? (
        <Instructions>
          <BtnsContainer>
            <CloseBtn onClick={() => setShowHelp(false)} />
            <Btn onClick={() => setContent(ContentHowToPlay)} style={{}}>
              How to Play
            </Btn>
            <Btn onClick={() => setContent(ContentHowToWin)}>How to Win</Btn>
            <Btn onClick={() => setContent(ContentCardValues)} style={{}}>
              Card Values
            </Btn>
          </BtnsContainer>
          <TextBox>{content}</TextBox>
        </Instructions>
      ) : (
        "?"
      )}
    </StyledBtnHelp>
  );
};

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  height: 100%;
  overflow-y: scroll;

  h2 {
    line-height: 1.2;
    padding-bottom: 1.5rem;
  }

  &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      background-color: rgba(127, 117, 151, 0.2);
      outline: 1px solid #7f7597;
    }

    &-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    &-corner {
      visibility: hidden;
    }
  }
`;

const CloseBtn = styled.button`
  position: relative;
  height: 6rem;
  width: 100%;

  padding: 0;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #7f7597;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);

    width: 3rem;
    height: 0.6rem;
    border-radius: 100rem;
    background-color: #c6b9e6;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);

    width: 3rem;
    height: 0.6rem;
    border-radius: 100rem;
    background-color: #c6b9e6;
  }
`;

const Btn = styled.button`
  font-size: 2rem;
  font-weight: 400;
  width: 6ch;
  z-index: 110;

  background-color: transparent;
  border: 1px solid #7f7597;
`;

const BtnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  > * {
    transition: all 0.2s;

    &:hover {
      background-color: rgba(197, 172, 255, 0.15);
    }
  }
`;

const Instructions = styled(motion.div)`
  display: flex;
  flex-direction: row-reverse;
  gap: 2rem;

  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6;
  text-align: start;
  color: white;

  height: 30rem;
  width: 30ch;

  h2 {
    font-weight: 600;
    position: relative;
    margin-bottom: 1rem;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;

      height: 1px;
      width: 90%;
      background-color: ${(props) => props.theme.gold};
    }
  }

  span {
    font-weight: 600;
    color: ${(props) => props.theme.gold};
  }

  @media only screen and (max-width: 67em) {
    flex-direction: row;
  }
`;

const StyledBtnHelp = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;

  background-color: ${(props) => props.theme.primaryColorDark};
  border: 1px solid #7f7597;
  color: #7f7597;
  border-radius: 4px;
  padding: 1.2rem 1.2rem;
  z-index: 100;

  backdrop-filter: blur(1.8 px) brightness(40%);

  transition: color 0.3s;

  &:hover {
    color: white;
  }
`;

export default BtnHelp;
