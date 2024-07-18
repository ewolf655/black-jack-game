import React, { useCallback, useContext, useEffect } from "react";
// Components
import BtnStand from "./components/UIButtons/BtnStand";
import BtnHit from "./components/UIButtons/BtnHit";
import GoBackBtn from "./components/UIButtons/BtnGoBack";
import BtnHelp from "./components/UIButtons/BtnHelp";
// Context
import AuthContext from "./AuthContext";
// Icons
import { CardIcon, DoubleIcon } from "./img/UiBtnIcons";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { outputResults } from "./redux/gameSlice";
// Styling
import { PlayingBtn } from "./Globals/GlobalStyles";
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import useGame from "./hook/useGame";

const UI = () => {
  const dispatch = useDispatch();

  const { user, telegramId, securityKey } = useContext(AuthContext);
  const { doubleDownProc, endGameProc } = useGame({ telegramId, securityKey });

  //// STATES
  const {
    bet,
    tempBank,
    playerHand,
    results,
    dealerPlaying,
    deckOfCards: deck,
    totalHandValue: {
      playerHand: playerHandTotal,
      dealerHand: dealerHandTotal,
    },
  } = useSelector((state) => state.game);

  const deckNum = deck.length;

  const handleDoubleDownClick = useCallback(() => {
    doubleDownProc();
  }, [doubleDownProc]);

  useEffect(() => {
    if (playerHandTotal === 21 && playerHand.length === 2) {
      setTimeout(() => {
        dispatch(outputResults());
        setTimeout(() => {
          endGameProc();
        }, 2000);
      }, 1000);
    }
  }, [playerHand.length, playerHandTotal, dispatch, endGameProc]);

  return (
    <Canvas>
      <MobileUI>
        {/* <GoBackBtn /> */}
        <div className="cards_info">
          <div className="cards-left">
            {CardIcon()}
            <h3>{deckNum ? deckNum : "err"}</h3>
          </div>
          <div className="dealer-tag">
            <h3>{dealerHandTotal}</h3>
            <h3>Dealer</h3>
          </div>
          <div className="player-tag">
            <h3>{playerHandTotal}</h3>
            <h3 style={{ color: user?.color }}>
              {user?.username?.length <= 6 ? user?.username : "Player"}
            </h3>
          </div>
        </div>
      </MobileUI>
      <CardsLeft>
        {CardIcon()}
        <h4>{deckNum ? deckNum : "err"}</h4>
      </CardsLeft>
      <ContainerHelp>
        <BtnHelp />
      </ContainerHelp>
      <DealerTag>
        {/* <GoBackBtn /> */}
        <h3>
          <span>{dealerHandTotal}</span>
          Dealer
        </h3>
      </DealerTag>
      <PlayerTag style={{ color: user?.color }}>
        <h3>
          <span>{playerHandTotal}</span>
          {user?.username || "Player"}
        </h3>
      </PlayerTag>
      <Bank>
        <h4>Bank: ${tempBank}</h4>
      </Bank>
      <BtnsContainer>
        <BetNum>
          <span>BET</span>${bet}
        </BetNum>
        <BtnsBox>
          <BtnStand />
          <BtnHit />
          <BtnDoubleDown
            onClick={handleDoubleDownClick}
            disabled={
              playerHand.length < 2 ||
              playerHand.length > 2 ||
              bet > tempBank ||
              results !== "none" ||
              dealerPlaying
            }
          >
            {DoubleIcon("3 3 25 25")} DOUBLE
          </BtnDoubleDown>
        </BtnsBox>
      </BtnsContainer>
    </Canvas>
  );
};
const MobileUI = styled.div`
  display: none;
  visibility: hidden;

  @media only screen and (max-width: 34em) {
    display: flex;
    gap: 1rem;
    visibility: visible;
  }
  .go_back--btn {
    top: 0.7rem;
    left: 0.8rem;
    z-index: 100;
    padding: 1rem;
  }

  .cards_info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    position: absolute;
    right: 0;
    top: 0;

    background-color: ${(props) => props.theme.primaryColorDark};
    padding: 1rem;
    border-bottom-left-radius: 7px;
    z-index: 100;

    svg {
      height: 3rem;
      width: 3rem;
    }

    > * {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    > div > h3:first-child {
      display: flex;
      justify-content: center;
      min-width: 2ch;
      font-size: 3rem;
      font-weight: 600;
    }

    .go_back--btn {
    }

    .cards-left {
      align-self: center;
      gap: 0.5rem;
    }
  }
`;

const ContainerHelp = styled(motion.div)`
  & .help--btn {
    display: none;
    top: 5.6rem;
    left: 0.8rem;

    @media only screen and (max-width: 67em) {
      display: inline;
    }
  }
`;

const BtnDoubleDown = styled(PlayingBtn)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  padding: 1rem;

  svg {
    height: 2.5rem;
    margin-right: 0.5rem;
  }
`;

const Canvas = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;

  border: 1px solid transparent;

  padding: 6rem 2rem;

  h3 {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 12ch;
    white-space: nowrap;
  }
`;

const CardsLeft = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  right: 0;
  font-size: 2rem;
  padding: 0.5rem 1rem 0.5rem 3rem;
  color: #d3d3d3;

  background-color: ${(props) => props.theme.primaryColorDark};
  clip-path: polygon(0 0, 100% 0, 100% 100%, 2.5rem 100%);

  @media only screen and (max-width: 34em) {
    display: none;
    visibility: hidden;
  }

  svg {
    height: 2.5rem;
  }
`;

const Bank = styled(motion.div)`
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 2rem;
  padding: 0.2rem 1rem 0.2rem 3rem;
  color: #d3d3d3;

  background-color: ${(props) => props.theme.primaryColorDark};
  clip-path: polygon(2.5rem 0, 100% 0, 100% 100%, 0% 100%);
`;

const DealerTag = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 3rem;
  color: #d3d3d3;

  padding: 0.5rem 5rem 0.5rem 1.8rem;
  background: ${(props) => props.theme.primaryColorDark};
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
  z-index: 100;

  @media only screen and (max-width: 67em) {
    padding-left: 1.2rem;
  }

  @media only screen and (max-width: 60em) {
    padding: 1.2rem 5rem 1.2rem 1.15rem;
  }

  @media only screen and (max-width: 34em) {
    display: none;
    visibility: hidden;
  }

  span {
    margin-right: 1rem;
  }

  & .go_back--btn {
    display: none;
    top: 0.8rem;
    left: 0.8rem;

    @media only screen and (max-width: 67em) {
      display: inline;
    }
  }
`;

const PlayerTag = styled(DealerTag)`
  padding-left: 1.5rem;
  padding-right: 5rem;
  bottom: 0;
  top: auto;
  clip-path: none;
  clip-path: polygon(0 0, 80% 0, 100% 100%, 0% 100%);

  span {
    color: #fff;
  }

  @media only screen and (max-width: 67em) {
    padding-right: 3.5rem;
  }
`;

const BtnsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  flex: 0 0 40%;

  height: 100%;

  @media only screen and (max-width: 40em) {
    flex-direction: row;
    justify-content: space-around;
    align-self: flex-end;
    flex: 0 0 100%;

    height: 40%;
  }
`;

const BetNum = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 6rem;
  font-weight: 200;

  span {
    font-size: 2rem;
    font-weight: 400;
  }

  @media only screen and (max-width: 39em) {
    font-size: 4rem;
  }
`;

const BtnsBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 17rem;
  z-index: 80;

  @media only screen and (max-width: 28em) {
    height: 19rem;
  }
`;

// export default React.memo(UI);
export default UI;
