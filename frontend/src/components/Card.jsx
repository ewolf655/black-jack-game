import React, { useState, useEffect } from "react";
// Components
import { JackFace, KingFace, QueenFace } from "../img/SvgCardArt";
import {
  ClubsSm,
  DiamondsSm,
  HeartsSm,
  SpadesSm,
  ClubsBig,
  DiamondsBig,
  HeartsBig,
  SpadesBig,
} from "../img/suitsIcons";
import { CardBackSVG2 } from "../img/CardBackSVG";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Card = ({ suit, value, index, handLength, animateFlag, isPlayersHand = true }) => {
  const [hideBool, setHideBool] = useState(false);

  const { results, dealerPlaying } = useSelector(
    (state) => state.game
  );

  const symbol = (s) => {
    switch (s) {
      case "C":
        return ClubsSm();
      case "D":
        return DiamondsSm();
      case "H":
        return HeartsSm();
      case "S":
        return SpadesSm();
      default:
        return "err";
    }
  };

  const symbolCardArt = (s) => {
    switch (s) {
      case "C":
        return ClubsBig("-55 -70 200 200");
      case "D":
        return DiamondsBig("-55 -70 200 200");
      case "H":
        return HeartsBig("-55 -70 200 200");
      case "S":
        return SpadesBig("-55 -70 200 200");
      default:
        return "err";
    }
  };

  const cardArt = (v, color, suit) => {
    switch (v) {
      case "J":
        return JackFace(color, "-10 -25 160 183");
      case "K":
        return KingFace(color, "0 0 175 160");
      case "Q":
        return QueenFace(color, "-15 -15 125 250");
      default:
        return symbolCardArt(suit);
    }
  };

  const flipTransition = {
    transition: {
      duration: 0.5,
      times: [0, 0.5, 1],
    },
  };

  const cardBackAnim = {
    initial: {
      rotateY: -180,
    },
    front: {
      rotateY: -180,
      ...flipTransition,
    },
    back: {
      rotateY: 0,
      ...flipTransition,
    },
  };

  const cardFrontAnim = {
    initial: {},
    front: {
      rotateY: 0,
      ...flipTransition,
    },
    back: {
      rotateY: 180,
      ...flipTransition,
    },
  };

  const cardAnim = {
    initial: {
      opacity: 0,
      y: !isPlayersHand ? -200 : 200,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    hover: {
      y: -10,
    },
  };

  // Makes sure the last card is only animated before the round concludes
  const animIf = () => {
    if (animateFlag === true && results === "none" && index === handLength - 1) {
      return "initial";
    } else return "animate";
  };

  useEffect(() => {
    if (dealerPlaying && index === 0) setHideBool(false);
    if (!dealerPlaying && index === 0 && !isPlayersHand) setHideBool(true);

    return () => {};
  }, [dealerPlaying, index, isPlayersHand]);

  return (
    <CardContainer
      className="card cont"
      variants={cardAnim}
      initial={animIf()}
      animate="animate"
      whileHover="hover"
    >
      <StyledCardBorder
        variants={cardFrontAnim}
        initial={
          index === 0 && !dealerPlaying && !isPlayersHand ? "back" : "initial"
        }
        animate={hideBool && !isPlayersHand ? "back" : "front"}
        className="front"
      >
        <StyledCard>
          <StyledCardContent>
            <StyledCardID>
              <div
                className="value"
                style={{
                  color: `${
                    suit === "D" ? "#f2ce30" : suit === "H" ? "#f2ce30" : "#ddd"
                  }`,
                }}
              >
                {value}
              </div>
              <div
                className="suit"
                style={{
                  color: `${
                    suit === "D" ? "#f2ce30" : suit === "H" ? "#f2ce30" : "#ddd"
                  }`,
                }}
              >
                {symbol(suit)}
              </div>
            </StyledCardID>
            <StyledCardArt
              className="svg-container"
              style={{
                color: `${
                  suit === "D" ? "#f2ce30" : suit === "H" ? "#f2ce30" : "#ddd"
                }`,
              }}
            >
              {cardArt(
                value,
                `${
                  suit === "D" ? "#f2ce30" : suit === "H" ? "#f2ce30" : "#ddd"
                }`,
                suit
              )}
            </StyledCardArt>
          </StyledCardContent>
        </StyledCard>
      </StyledCardBorder>
      <StyledCardBorder
        variants={cardBackAnim}
        initial={
          index === 0 && !dealerPlaying && !isPlayersHand ? "back" : "initial"
        }
        animate={hideBool && !isPlayersHand ? "back" : "front"}
        className="back"
      >
        <StyledCardBack>
          <Cardback>{CardBackSVG2("2 0 176 241")}</Cardback>
        </StyledCardBack>
      </StyledCardBorder>
    </CardContainer>
  );
};

const CardContainer = styled(motion.div)`
  position: relative;

  height: 20rem;
  width: 14.91rem;
  transform: perspective(40rem);

  & > .front {
    backface-visibility: hidden;
  }

  & > .back {
    backface-visibility: hidden;
  }
`;

const Cardback = styled(motion.div)`
  height: 100%;
  width: 100%;
  overflow: hidden;
  filter: hue-rotate(200deg) saturate(50%) contrast(160%);
  svg {
    overflow: hidden;
    filter: brightness(35%) sepia(100%);

    @media only screen and (max-width: 28em) {
      transform: scale(0.75) translate(-40px, -50px);
    }
  }
`;

const StyledCard = styled(motion.div)`
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;

  height: 20rem;
  width: 14.91rem;
  padding: 1rem;
  background-image: linear-gradient(to top right, #050608, #171a1f);
  color: black;
  border-radius: 1rem;
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.3);
`;

const StyledCardBack = styled(StyledCard)`
  padding: 0;
`;

const StyledCardBorder = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;

  z-index: -1;
  padding: 1.5px;
  border-radius: 1.2rem;
  background: linear-gradient(to top right, #181722 10%, #222631 90%, #424858);

  transition: inherit;
`;

const StyledCardContent = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
`;

const StyledCardID = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: -0.2rem;
  left: 0;

  font-size: 4rem;
  line-height: 1;

  .suit {
    margin-top: -0.2rem;
    font-size: 3rem;
  }
`;

const StyledCardArt = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 110%;

  // temp
  font-size: 8rem;
  font-weight: 600;
  color: white;

  position: absolute;
  right: -10px;
  bottom: 0;

  svg {
    width: 110%;
    height: 110%;
  }
`;

export default Card;
