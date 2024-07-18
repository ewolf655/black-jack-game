import React from "react";
// Components
import UserRank from "./UserRank";
import PaginationController from "./PaginationController";
import Loading from "./loadingEl";
// Styling
import styled from "styled-components";

const LeaderboardContainer = ({
  ranks,
//   setPage,
//   page,
//   resultsLength,
//   currentUserRank,
}) => {
  const randomWidth = () => {
    let width = Math.random() * 100;

    if (width < 30) width = 30;

    return { width: `${width}%` };
  };

  return (
    <LeaderBoard>
      <h1>LEADERBOARD</h1>
      <RanksBox style={{ overflowY: ranks ? "scroll" : "hidden" }}>
        {ranks ? (
          <>
            {ranks.map((el, i) => (
              <UserRank user={el} key={i} />
            ))}
            {/* <PaginationController
              setPage={setPage}
              page={page}
              resultsLength={resultsLength}
              currentUserRank={currentUserRank}
            /> */}
          </>
        ) : (
          [1, 2, 3].map((el, i) => (
            <BlankRank key={i}>
              <RankValue>
                <Loading />
              </RankValue>
              <h3>&nbsp;</h3>
              <p style={randomWidth()}>&nbsp;</p>
              <p style={randomWidth()}>&nbsp;</p>
            </BlankRank>
          ))
        )}
      </RanksBox>
    </LeaderBoard>
  );
};

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
  height: 11rem;
  width: 11rem;

  color: #424153;
`;

const BlankRank = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 11rem 1fr;
  justify-content: center;
  align-items: center;
  column-gap: 2.6rem;
  row-gap: 1.4rem;

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

    background-color: rgba(127, 117, 151, 0.3);
    border-radius: 4px;
  }
  h3 {
    background-color: rgba(127, 117, 151, 0.3);
    border-radius: 4px;
  }
  p span {
    font-size: 1.6rem;
    color: rgba(225, 214, 255, 0.6);
  }
`;

const RanksBox = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;

  height: 100%;

  padding: 2rem 0 7rem;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;

    &-thumb {
      background-color: rgba(127, 117, 151, 0.2);
      outline: 1px solid #7f7597;
    }

    &-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    &-corner {
      visibility: hidden;
    }
  }
`;

const LeaderBoard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  max-height: 90vh;
  width: 100%;
  max-width: 120rem;

  background-color: rgba(18, 16, 24, 0.6);
  border-radius: 4px;
  border: 1px solid #7f7597;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: calc(100% - 10rem);
    width: 100%;
    z-index: 3;
    pointer-events: none;

    background-image: linear-gradient(
      to bottom,
      rgba(167, 119, 255, 0.06),
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 90%,
      rgba(167, 119, 255, 0.06)
    );
  }

  h1 {
    flex: 0 0 10rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 300;
    font-size: 5.8rem;

    background-color: #6558aa40;
    border-bottom: 1px solid #7f7597;

    @media only screen and (max-width: 35em) {
      font-size: 10vw;
    }
  }
`;

export default LeaderboardContainer;
