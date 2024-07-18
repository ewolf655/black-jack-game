import React from "react";
// Components
import UI from "../UI";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import RoundResults from "./RoundResults";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
// Redux
import { useSelector } from "react-redux";

const Board = () => {
  const results = useSelector((state) => state.game.results);

  const BoardAnim = {
    initial: {
      x: 1300,
    },
    animate: {
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.48, 0.32, 0.57, 1.02],
      },
    },
  };

  return (
    <Container>
      <StyledBoardOut variants={BoardAnim} initial="initial" animate="animate">
        <StyledBoardBorder>
          <StyledBoardIn>
            {results !== "none" ? <RoundResults /> : ""}
            <UI />
            <ContainerHands>
              <DealerHand />
              <PlayerHand />
            </ContainerHands>
          </StyledBoardIn>
        </StyledBoardBorder>
      </StyledBoardOut>
    </Container>
  );
};

const ContainerHands = styled(motion.div)`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 70%;
  height: 100%;

  @media only screen and (max-width: 40em) {
    width: 100%;
    height: 65%;
    /* border: 1px solid red; */
  }
`;

const Container = styled(motion.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const StyledBoardOut = styled(motion.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(to bottom, #1f1d22, #15101b);
  border-radius: 0.4rem;
  max-height: 70rem;
  max-width: 94.4rem;
  height: 100%;
  width: 100%;
  padding: 2.8rem;
  box-shadow: 0 3rem 8rem rgba(0, 0, 0, 0.7);

  @media only screen and (max-width: 58.75em) {
    top: 0;
    padding: 1rem;
    max-height: 92vh;
    max-width: 95%;
  }
`;

const StyledBoardIn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;

  background: ${(props) => props.theme.primaryColor};
  height: 100%;
  width: 100%;
  padding: 9rem 2rem;
  overflow: hidden;

  background-clip: padding-box;
  border: solid 1px transparent;
  border-radius: 0.4rem;

  @media only screen and (max-width: 40em) {
    padding: 7rem 2rem 9em;
  }
`;

const StyledBoardBorder = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-image: ${(props) => props.theme.borderGold};
  border-radius: 0.4rem;
  box-shadow: 0 0 3rem rgba(0, 0, 0, 0.4);
`;

export default React.memo(Board);
