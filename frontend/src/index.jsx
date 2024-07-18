import React from "react";
import ReactDOM from "react-dom/client";
// Components
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Context
import { AuthProvider } from "./AuthContext";
// Redux
import { Provider } from "react-redux";
import store from "./store";
// Router
import { BrowserRouter } from "react-router-dom";
// Google Analytics
import ReactGA from "react-ga";

const TRACKING_ID = "G-N7LTFMKQDJ";
ReactGA.initialize(TRACKING_ID);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
