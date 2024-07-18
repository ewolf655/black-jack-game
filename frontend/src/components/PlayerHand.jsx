import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
// Components
import Card from "./Card";
import { StyledHand } from "../Globals/GlobalStyles";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";

const PlayerHand = () => {
  const playerHand = useSelector((store) => store.game.playerHand);
  const dealerPlaying = useSelector((store) => store.game.dealerPlaying);
  const cards = playerHand.map((card, index) => {
    return (
      <Card
        suit={card.suit}
        value={card.value}
        key={uuidv4()}
        index={index}
        handLength={playerHand.length}
		animateFlag={!dealerPlaying}
      />
    );
  });

  return (
    <>
      <StyledHand
        className="playerHand"
        style={{
          width: `${14.5 + 4 * (cards.length - 1)}rem`,
          transition: "all 0.5s",
        }}
      >
        {cards
          ? cards.map((card, index) => {
              return (
                <Card1 key={uuidv4()} style={{ left: `${index * 4}rem` }}>
                  {card}
                </Card1>
              );
            })
          : ""}
      </StyledHand>
    </>
  );
};

const Card1 = styled(motion.div)`
  position: absolute;
  left: 0;
  z-index: 10;
`;

export default React.memo(PlayerHand);
