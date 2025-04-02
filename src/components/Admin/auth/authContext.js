import React, { createContext, useState } from "react";
import { useCookies } from "react-cookie";

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["uToken"]);
  const [accessToken, setAccessToken] = useState(cookies.uToken ? cookies.uToken : null);

  // Optional: Add functions to manage the token
  const saveToken = (token) => {
    setAccessToken(token);
  };

  const clearToken = () => {
    setAccessToken(null);
  };

  return <AuthContext.Provider value={{ accessToken, saveToken, clearToken }}>{children}</AuthContext.Provider>;
};
