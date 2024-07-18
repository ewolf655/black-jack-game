import React, { useEffect, useCallback, useState, useContext } from "react";
// Styling
import { PlayingBtn } from "../../Globals/GlobalStyles";
// Icons
import { StandIcon } from "../../img/UiBtnIcons";
// REDUX
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../AuthContext";
import useGame from "../../hook/useGame";

const BtnStand = () => {
  // STATES
  const [buttonClicked, setButtonClicked] = useState(false);

  // Context
  const { telegramId, securityKey } = useContext(AuthContext);

  const {
    results,
    totalHandValue: {
      playerHand: playerHandTotal,
    },
    cardsShuffled,
  } = useSelector((store) => store.game);

  const playerHandLength = useSelector((state) => state.game.playerHand).length;
  const { standProc } = useGame({ telegramId, securityKey });

  const handleClick = useCallback(() => {
    setButtonClicked(true);
    standProc();
  }, [standProc]);

  useEffect(() => {
    if (cardsShuffled === true) {
      setButtonClicked(false);
    }
  }, [cardsShuffled]);

  return (
    <PlayingBtn
      onClick={handleClick}
      disabled={
        playerHandLength < 2 ||
        buttonClicked ||
        playerHandTotal < 1 ||
        playerHandTotal > 20 ||
        results !== "none"
      }
    >
      {StandIcon()} STAND
    </PlayingBtn>
  );
};

export default React.memo(BtnStand);
