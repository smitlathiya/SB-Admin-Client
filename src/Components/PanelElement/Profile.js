import React from "react";
import "./Profile.css";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import ProfileCompo from "./ProfileCompo";

const Profile = () => {
  const { redirectToReferer, authData } = useAuth();
  let redirect = null;

  if (redirectToReferer) {
    redirect = <Navigate to="/signin" />;
  }

  return (
    <>
      {redirect}
      <ProfileCompo id={authData.id} isCurrentUser={true} />
    </>
  );
};

export default Profile;
