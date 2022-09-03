import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useAuth } from "../../AuthContext/AuthContext";
import Postcard from "../Postcard";
import { Navigate } from "react-router-dom";
import Spinner from "../Spinner";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const { authData, redirectToReferer } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    if (authData) {
      axios
        .get(`/posts`, {
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        })
        .then((res) => {
          setLoading(false)
          setPosts(res.data.posts);
        })
        .catch(e => {
          setLoading(false)
        });
    }
  }, [authData]);

  let redirect = null;

  if (redirectToReferer) {
    redirect = <Navigate to="/signin" />;
  }

  return (
    <main>
      {loading ? <Spinner /> : null}
      {redirect}
      <div className="container-fluid px-4">
        <div className="card-wrapper">
          {posts.map((data) => {
            return (
              <Postcard
                postData={data}
                key={data._id}
                photoUrl={
                  data.photo
                    ? `${process.env.REACT_APP_API_URL}/post/img/${data._id}`
                    : null
                }
                menu={false}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
