import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router";
// Components
import GoBackBtn from "./UIButtons/BtnGoBack";
import Loading, { LoadingContainer } from "./loadingEl";
// Context
import AuthContext from "../AuthContext";
// Styling
import styled from "styled-components";
// Animation
import { motion } from "framer-motion";
import { pageAnimation } from "../animations";

const BasePage = ({ children, useContainer }) => {
  const { user, setError } = useContext(AuthContext);
  const location = useLocation();

  const useGoBackBtn =
    location.pathname !== "/" && location.pathname !== "/play" && location.pathname !== "/error" && location.pathname !== "/leaderboard";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setError(null);
  }, []);

  return (
    <PageContainer>
      <Page
        variants={pageAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        style={location.pathname === "/play" ? { gap: 0 } : {}}
      >
        {user === "pending" ? (
          <>
            <LoadingContainer>
              <Loading style={{ color: "white" }} />
            </LoadingContainer>
            <LoadingMessage>Loading...</LoadingMessage>
          </>
        ) : (
          <>
            {useContainer ? (
              <Container>
                {useGoBackBtn && <GoBackBtn />}
                {children}
              </Container>
            ) : (
              <>
                {useGoBackBtn && <GoBackBtn />}
                {children}
              </>
            )}
          </>
        )}
      </Page>
    </PageContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.6rem;

  min-height: 100vh;
  width: 100%;
  padding: 2rem;
`;

const Page = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  min-height: 100vh;

  // for loading element
  div:first-child {
    margin-left: 0;
  }
`;

const PageContainer = styled(motion.div)`
  overflow-x: hidden;
`;

const LoadingMessage = styled.p`
  font-size: 2rem;
`;

export default BasePage;
