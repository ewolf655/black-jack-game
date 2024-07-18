import React, { useContext } from "react";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PaginationController = ({
  page,
  setPage,
  resultsLength,
  currentUserRank,
}) => {
  const lastPage = Math.ceil(resultsLength / 5); // resultsLength / resultsPerPageLength
  const currentUserRankPage = Math.ceil(currentUserRank / 5);
  const currentUserIsOnThisPage = page === currentUserRankPage;

  const { user } = useContext(AuthContext);

  const PaginationBtnHandler = (incre) => {
    // short for increment
    if (incre === "+") {
      setPage(page + 1);
    }
    if (incre === "-") {
      setPage(page - 1);
    }
  };

  const JumpToHandler = () => {
    if (currentUserIsOnThisPage) return;

    setPage(currentUserRankPage);
  };

  return (
    <PaginationContainer>
      <PaginationBox>
        <PageBtn
          onClick={() => PaginationBtnHandler("-")}
          // disabled={page > 1}
          style={page > 1 ? {} : { pointerEvents: "none", opacity: "0.4" }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </PageBtn>
        <PageNum>{page}</PageNum>
        <Of>of</Of>
        <PageNum>{lastPage}</PageNum>
        <PageBtn
          // disabled={page < lastPage}
          onClick={() => PaginationBtnHandler("+")}
          style={
            page < lastPage ? {} : { pointerEvents: "none", opacity: "0.4" }
          }
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </PageBtn>
      </PaginationBox>
      {user && (
        <JumpToRankBtn
          onClick={JumpToHandler}
          style={
            currentUserIsOnThisPage
              ? {
                  backgroundColor: "#1c113a79",
                  color: "#fff",
                  fontWeight: 400,
                  border: "2px solid #7f7597",
                }
              : {}
          }
        >
          {currentUserIsOnThisPage
            ? "Your rank is on this page"
            : "I wanna see my rank!"}
        </JumpToRankBtn>
      )}
    </PaginationContainer>
  );
};

const JumpToRankBtn = styled.button`
  z-index: 10;

  font-size: 1.6rem;
  font-weight: 600;
  color: #0e0027;

  width: 100%;
  padding: 0.6rem 0;
  border-radius: 2px;
  background-color: #ae9fcf;

  transition: all 0.2s;

  margin-bottom: 1rem;

  &:hover {
    background-color: #c2c9e7;
  }

  &:active {
    background-color: #64517a;
  }
`;

const Of = styled.div`
  font-size: 1.6rem;
  padding: 0 1rem;
`;

const PageNum = styled.button`
  background-color: transparent;
  min-width: 2ch;
  padding: 0;

  transition: transform 0.2s;
  &:hover {
    transform: translateY(-0.3rem);
  }
`;

const PageBtn = styled.button`
  background-color: transparent;

  color: #fff;
  font-size: 2rem;

  transition: transform 0.2s;
  &:hover {
    transform: translateY(-0.3rem);
  }
`;

const PaginationBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;

  padding: 0 1rem;
  background-color: rgba(22, 15, 31, 0.8);
  border: 2px solid #7f7597;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export default PaginationController;
