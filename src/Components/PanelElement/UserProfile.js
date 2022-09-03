import React from "react";
import "./Profile.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import ProfileCompo from "./ProfileCompo";

const UserProfile = () => {
  const { authData } = useAuth();
  const userId = useParams().userId;

  return (
    <ProfileCompo id={userId} isCurrentUser={userId == authData.id} />
  );
};

export default UserProfile;
