import React, { useContext } from "react";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";

const UserRank = ({ user }) => {
	const { telegramId } = useContext(AuthContext)

  const rankColor = (rank) => {
    let color;
    switch (rank) {
      case 1:
        color = "#ffd000";
        break;
      case 2:
        color = "#a8a8a8";
        break;
      case 3:
        color = "#805533";
        break;
      default:
        color = "#7271944c";
    }
    return {
      backgroundColor: color,
    };
  };

  return (
    <Rank
      style={
        user.user.telegramId === telegramId
          ? {
              border: `2px solid rgb(0, 160, 0)`,
              boxShadow: `0px 0px 16px -2px rgba(255, 255, 255, 0.5)`,
            }
          : {}
      }
    >
      <RankValue>
        {user.rank}
        <Circle style={rankColor(user.rank)} />
      </RankValue>
      <h3 style={{ color: rankColor(user.rank) }}>@{user.user.userName}</h3>
      <p>
        <span>Highscore:&nbsp;</span>
        {user.highScore}
      </p>
      <p>
        <span>Current score:&nbsp;</span>
        {user.profit - user.lose}
      </p>
	  <p>
        <span>Played Times:&nbsp;</span>
        {user.playedTimes}
      </p>
	  <p>
        <span>Win Times:&nbsp;</span>
        {user.winTimes}
      </p>
	  <p>
        <span>Lose Times:&nbsp;</span>
        {user.loseTimes}
      </p>
	  <p>
        <span>Total Wager:&nbsp;</span>
        {user.wager}
      </p>
    </Rank>
  );
};

const Circle = styled.div`
  position: absolute;
  height: 11rem;
  width: 11rem;
  z-index: -1;
  border-radius: 100%;

  background-color: #7271944c;
`;

const RankValue = styled.div`
  position: relative;
  grid-row: 1/-1;
  grid-column: 1/2;

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  font-weight: 600;
  font-size: 3.2rem;
  text-shadow: 0px 0px 12px rgba(0, 1, 17, 0.521);
`;

const Rank = styled.li`
  position: relative;

  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 11rem 1fr;
  justify-content: center;
  column-gap: 2.6rem;

  font-size: 2rem;

  min-width: 40rem;
  padding: 2rem;
  background-color: rgba(189, 137, 207, 0.08);

  border: 1px solid #7f7597;
  border-radius: 7px;

  p {
    grid-column: 2/3;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    font-size: 2rem;
  }
  h3 {
    display: flex;

    font-weight: 600;
    font-size: 2.4rem;
  }
  p span {
    font-size: 1.6rem;
    color: rgba(225, 214, 255, 0.6);
  }
`;

export default UserRank;
