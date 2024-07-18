import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
// Config
import { API_URL } from "./config";
import useSecurityKey from "./hook/useSecurityKey";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { telegramId, securityKey } = useSecurityKey();
  const [user, setUser] = useState("pending");
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      if (true) {
        // Setting cookies
        Cookies.set("jwt", "token", {
          expires: 90,
          secure: process.env.NODE_ENV !== "development",
        });
        setUser({ email, password });
        setError(null);
      } else {
        setError(
          "Login failed. Email or password may be incorrect, please try again"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async (email, password, username, color) => {
    if (true) {
      // Setting cookies
      Cookies.set("jwt", "token", {
        expires: 90,
        secure: process.env.NODE_ENV !== "development",
      });
      setUser({ email, password, username, color });
      setError(null);
    } else {
      setError("Sign up failed");
    }
  };

  const logout = async () => {
    Cookies.remove("jwt");
    setUser(null);
  };

  const changePasswordHandler = async (currentPassword, newPassword) => {
    const token = Cookies.get("jwt");

    const res = await fetch(`${API_URL}/users/updatePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      logout();
    } else {
      setError(data.message);
    }
  };

  const checkUserLoggedIn = async () => {
    if (false) {
      setUser({});
    } else setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        setError,

        login,
        signup,
        logout,
        changePasswordHandler,
        telegramId,
        securityKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
