import React, { useCallback, useContext, useEffect } from "react";
// icons
import { HitIcon } from "../../img/UiBtnIcons";
// Styling
import { PlayingBtn } from "../../Globals/GlobalStyles";
// Redux
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../../AuthContext";
import useGame from "../../hook/useGame";

const BtnHit = React.memo(() => {
  const dispatch = useDispatch();
  const { telegramId, securityKey } = useContext(AuthContext);

  const {
    dealerPlaying,
    deckOfCards: deck,
    totalHandValue: { playerHand: playerHandTotal },
  } = useSelector((store) => store.game);

  const playerHandLength = useSelector((store) => store.game.playerHand).length;
  const { hitProc } = useGame({ telegramId, securityKey });

  const handleClick = useCallback(() => {
    hitProc();
  }, [hitProc]);

  return (
    <PlayingBtn
      onClick={handleClick}
      disabled={playerHandTotal > 20 || dealerPlaying || playerHandLength < 2}
    >
      {HitIcon()} HIT
    </PlayingBtn>
  );
});

export default BtnHit;
