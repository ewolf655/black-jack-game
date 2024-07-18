import axios from "axios";
import { API_URL } from "../config";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLastSave,
  outputResults,
  setCardsShuffled,
  setLeaderboard,
  updateRoundData,
} from "../redux/gameSlice";

const useGame = ({ telegramId, securityKey }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bet = useSelector((state) => state.game.bet);

  const createNewRound = useCallback(() => {
    axios
      .post(`${API_URL}/round/new`, {
        telegramId,
        key: securityKey,
        chips: bet,
      })
      .then((r) => {
        if (r.data.status === true) {
          dispatch(updateRoundData(r.data.round));
          dispatch(setCardsShuffled());
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, bet, dispatch]);

  const endGameProc = useCallback(() => {
    axios
      .post(`${API_URL}/round/end`, {
        telegramId,
        key: securityKey,
      })
      .then((r) => {
        if (r.data.status === true) {
          dispatch(updateRoundData(r.data.round));
          dispatch(getLastSave(r.data.chips));
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, dispatch]);

  const standProc = useCallback(() => {
    axios
      .post(`${API_URL}/round/stand`, {
        telegramId,
        key: securityKey,
      })
      .then((r) => {
        if (r.data.status === true) {
          dispatch(updateRoundData(r.data.round));
          setTimeout(() => {
            dispatch(outputResults());
            setTimeout(() => {
              endGameProc();
            }, 2000);
          }, 1000);
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, dispatch, endGameProc]);

  const hitProc = useCallback(() => {
    axios
      .post(`${API_URL}/round/hit`, {
        telegramId,
        key: securityKey,
      })
      .then((r) => {
        if (r.data.status === true) {
          dispatch(updateRoundData(r.data.round));
          if (r.data.round?.playerHand > 20) {
            setTimeout(() => {
              dispatch(outputResults());
              setTimeout(() => {
                endGameProc();
              }, 2000);
            }, 1000);
          }
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, dispatch]);

  const doubleDownProc = useCallback(() => {
    axios
      .post(`${API_URL}/round/double-down`, {
        telegramId,
        key: securityKey,
      })
      .then((r) => {
        if (r.data.status === true) {
          dispatch(updateRoundData(r.data.round));
		  dispatch(getLastSave(r.data.chips));
          setTimeout(() => {
            dispatch(outputResults());
            setTimeout(() => {
              endGameProc();
            }, 2000);
          }, 1000);
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, dispatch, endGameProc]);

  const loadLeaderboard = useCallback(() => {
    axios
      .get(`${API_URL}/stat/leaderboard?telegramId=${telegramId}&key=${securityKey}`)
      .then((r) => {
        if (r.data.status === true) {
          dispatch(setLeaderboard(r.data.leaderboard));
        } else {
          navigate("/error", { state: { error: r.data.error } });
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error", { state: { error: err.message } });
      });
  }, [navigate, telegramId, securityKey, dispatch]);

  return { createNewRound, standProc, hitProc, doubleDownProc, endGameProc, loadLeaderboard };
};

export default useGame;
