import React, { useContext, useEffect, useState } from "react";
// Components
import BasePage from "../components/BasePage";
import LeaderboardModal from "../components/LeaderboardModal";
// Context
import AuthContext from "../AuthContext";
import useGame from "../hook/useGame";
import { useSelector } from "react-redux";
// Config

// user data: rank, username, color, highScore, currentScore

const constRanks = [
  {
    rank: 1,
    username: "Alex",
    highScore: 120,
    currentScore: 15,
  },
  {
    rank: 2,
    username: "Tom",
    highScore: 119,
    currentScore: 34,
    self: true,
  },
  {
    rank: 3,
    username: "Jimmy",
    highScore: 104,
    currentScore: 65,
  },
  {
    rank: 4,
    username: "Tod",
    highScore: 98,
    currentScore: 88,
  },
  {
    rank: 5,
    username: "Jenkins",
    highScore: 96,
    currentScore: 64,
  },
  {
    rank: 6,
    username: "Philips",
    highScore: 89,
    currentScore: 76,
  },
  {
    rank: 7,
    username: "???",
    highScore: 77,
    currentScore: 34,
  },
];

const LeaderboardPage = () => {
  const leaderboard = useSelector(state => state.game.leaderboard)
//   const [currentUserRank, setCurrentUserRank] = useState(null);
//   const [page, setPage] = useState(0);
//   const [resultsLength, setResultsLength] = useState(3);

  const { telegramId, securityKey } = useContext(AuthContext);
  const { loadLeaderboard } = useGame({telegramId, securityKey})
  const [ranks, setRanks] = useState(false);

  useEffect(() => {
	if (telegramId !== undefined && securityKey !== undefined) {
    	loadLeaderboard()
	}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadLeaderboard, telegramId, securityKey]);

  useEffect(() => {
	if (leaderboard.length > 0) {
		setRanks(leaderboard)
	}
  }, [leaderboard, leaderboard.length])

  return (
    <BasePage useContainer={true}>
      <LeaderboardModal
        ranks={ranks}
        // setPage={setPage}
        // page={page}
        // resultsLength={resultsLength}
        // currentUserRank={currentUserRank}
      />
    </BasePage>
  );
};

export default LeaderboardPage;
