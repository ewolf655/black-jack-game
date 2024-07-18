import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./redux/gameSlice";

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export default store;
