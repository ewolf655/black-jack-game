import { createSlice } from "@reduxjs/toolkit";
import {
  convertNumberToCard,
} from "../data/deckOfCards";

// BUG: while distributing cards, it adds 10 when the first card is hidden and an ace
const initialState = {
  deckOfCards: [],
  playerHand: [],
  dealerHand: [],
  totalHandValue: {
    dealerHand: 0,
    playerHand: 0,
  },
  bank: 0, // There is 2 to avoid weird calculations. I know it's weird but trust me
  tempBank: 0,
  bet: 0,
  betArr: [0],
  dealerPlaying: false,
  results: "none", // dealer/player/push/none
  cardsShuffled: false,
  leaderboard: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCardShuffledBoolFalse(state) {
      state.cardsShuffled = false;
    },
    getLastSave: {
      reducer(state, action) {
        state.bank = action.payload.bank;
        state.tempBank = action.payload.bank;
      },
      prepare(bank) {
        return {
          payload: { bank },
        };
      },
    },

    outputResults(state) {
      const { playerHand, dealerHand } = state.totalHandValue;

      if (
        (playerHand <= 21 && playerHand > dealerHand) ||
        (dealerHand > 21 && playerHand <= 22)
      )
        state.results = "player";

      if (
        (dealerHand <= 21 && dealerHand > playerHand) ||
        (playerHand > 21 && dealerHand <= 22)
      )
        state.results = "dealer";

      if (dealerHand === playerHand) state.results = "push";

      if (dealerHand > 21 && playerHand > 21) state.results = "bust";
    },

    calcBet: {
      reducer(state, action) {
        const betArr = action.payload.betArr;

        state.betArr = betArr;
        state.bet = state.betArr.reduce((acc, cur) => acc + cur, 0);
        state.tempBank = state.bank - state.bet;
      },
      prepare(betArr) {
        return {
          payload: {
            betArr,
          },
        };
      },
    },
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

    updateRoundData(state, action) {
      state.bet = action.payload?.chips ?? 0;
      state.deckOfCards =
        action.payload?.deck.map((c) => convertNumberToCard(c)) ?? [];
      state.playerHand =
        action.payload?.player.map((c) => convertNumberToCard(c)) ?? [];
      state.dealerHand =
        action.payload?.dealer.map((c) => convertNumberToCard(c)) ?? [];
      state.totalHandValue.playerHand = action.payload?.playerHand ?? 0
      state.totalHandValue.dealerHand = action.payload?.dealerHand ?? 0
	  state.dealerPlaying = action.payload?.hand === 'dealer'

	  state.results = 'none'
    },
    setCardsShuffled(state) {
      state.cardsShuffled = true;
    },
	setLeaderboard(state, action) {
		state.leaderboard = action.payload
	}
  },
});

export const {
  setCardShuffledBoolFalse,

  getLastSave,
  outputResults,
  calcBet,
  updateRoundData,
  setCardsShuffled,
  setLeaderboard
} = gameSlice.actions;

export default gameSlice.reducer;
