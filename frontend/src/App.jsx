import React, { useEffect, useContext } from "react";
// Pages
import ForgotPassword from "./pages/ForgotPassword";
import Gaming from "./pages/Gaming";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Me from "./pages/Me";
import ChangePassword from "./pages/ChangePassword";
// Components
import GlobalTheme from "./Globals/GlobalTheme";
import { getLastSave } from "./redux/gameSlice";
import { HeartsSm } from "./img/suitsIcons";
// Context
import AuthContext from "./AuthContext";
// Styling
import styled from "styled-components";
import GlobalStyles from "./Globals/GlobalStyles";
import { ThemeProvider } from "styled-components";
// Router
import { Routes, Route, useLocation } from "react-router-dom";
// Animation
import { AnimatePresence } from "framer-motion";
// Redux
import Error from "./pages/Error";

function App() {
  return (
    <ThemeProvider theme={GlobalTheme}>
      <GlobalStyles />
      <AuthorTag>
        <HeartsSm />
        Made by cryptoguy1119
      </AuthorTag>
      <AnimatePresence mode="wait">
        <Routes>
          {/* <Route exact path="/" element={<Home/>} /> */}
          <Route exact path="/play" element={<Gaming />} />
          {/* <Route exact path="/forgot-password" element={<ForgotPassword/>} /> */}
          <Route exact path="/leaderboard" element={<Leaderboard/>} />
          {/* <Route exact path="/login" element={<Login/>} />
          <Route exact path="/me" element={<Me/>} />
          <Route exact path="/change-password" element={<ChangePassword/>} />
          <Route
            exact
            path="/reset-password/:resetToken"
            element={<ResetPassword/>}
          />
          <Route exact path="/signup" element={<Signup/>} /> */}
		  <Route exact path="/error" element={<Error/>} />
          <Route exact path="*" element={<NotFound/>} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

const AuthorTag = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;

  display: flex;
  align-items: center;

  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;

  svg {
    height: 1.6rem;
    width: 1.6rem;
    margin-right: 1rem;
  }
`;

export default App;
