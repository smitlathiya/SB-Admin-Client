import React from "react";
import { Navigate } from "react-router-dom";
import { currentUser } from "./AuthContext/AuthContext";

export default function PrivateRoute({ children }) {
  return currentUser() ? children : <Navigate to="/signin" />;
}
