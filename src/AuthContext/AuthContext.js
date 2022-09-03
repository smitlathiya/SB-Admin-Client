import axios from "axios";
import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import avtar from '../assets/avatar.png'
import Spinner from "../Components/Spinner";
import { NotificationContainer, NotificationManager } from "react-notifications";
import avatar from "../assets/avatar.png"
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = (props) => {
  const [authData, setAuthData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPass, setForgotPass] = useState(null);
  const [redirectToReferer, setRedirectToReferer] = useState(false);
  const [currentUserPost, setCurrentUserPost] = useState(null);
  const [profileImage, setProfileImage] = useState(avtar);
  const [profileData, setProfileData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    date_of_birth: "",
    phone_no: "",
    address: {
      city: "",
      state: "",
      country: "",
    },
    designation: "",
    website: "",
    contentType: "",
    followers: [],
    following: []
  });


  const login = (email, password, setLoginRedirect) => {
    setLoading(true)
    const cred = {
      email: email,
      password: password,
    };
    axios
      .post("/signin", cred)
      .then((res) => {
        authenticate(res.data, () => {
          setLoginRedirect(true);
          setRedirectToReferer(false)
          setLoading(false)
        });
      })
      .catch((e) => {
        NotificationManager.error(e.response.data.error, 'Login Fail', 3000)
        if (typeof window != "undefined") localStorage.removeItem("jwt");

        setLoading(false)
      });
  };

  const googleLogin = (data, username, setLoginRedirect) => {
    const googleData = {
      password: data.googleId,
      name: {
        last_name: data.familyName,
        first_name: data.givenName
      },
      email: data.email,
      username: username
    }
    axios.post("/social-login", googleData)
      .then(res => {
        authenticate(res.data, () => {
          setLoginRedirect(true);
          setRedirectToReferer(false)
          setLoading(false)
        });
      })
      .catch((e) => {
        NotificationManager.error(e.response.data.error, "Error", 3000)
        if (typeof window != "undefined") localStorage.removeItem("jwt");

        setLoading(false)
      });
  }
  const authenticate = (jwt, next) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jwt", JSON.stringify(jwt));
      setAuthData({
        id: jwt.user._id,
        email: jwt.user.email,
        token: jwt.token,
      });
      next();
    }
  };

  const signup = (fname, lname, email, username, password) => {
    setLoading(true)
    const userData = {
      name: {
        first_name: fname,
        last_name: lname,
      },
      email: email,
      username: username,
      password: password,
      designation: "",
      date_of_birth: "",
      address: {
        city: "",
        state: "",
        country: "",
      },
      phoneNo: "",
      website: "",
      profile_image: {
        code: null,
        contentType: null,
      },
    };
    axios
      .post("/signup", userData)
      .then((res) => {
        NotificationManager.success("Please Login", "Registerd Successfully", 3000)
        setLoading(false)
      })
      .catch((e) => {
        NotificationManager.error(e.response.data.error, "Error", 3000)
        setLoading(false)
      });
  };

  const editProfile = (data, setLoading) => {
    setLoading(true)
    axios
      .put(`/user/${authData.id}`, data, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authData.token}`,
          email: authData.email,
        },
      })
      .then(() => {
        NotificationManager.success("Data has been updated", "Done", 3000)
        setLoading(false)
      })
      .catch((e) => {
        NotificationManager.error(e.response.data.error, "Faild", 3000)
        setLoading(false)
      });
  }

  const updatePassword = (data, success) => {
    axios.put('/change-password', data, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`
      }
    })
      .then(res => {
        NotificationManager.success(res.data.message, "You can login with New Password", 3000)
        success()
      })
      .catch(e => {
        NotificationManager.error(e.response.data.error, "Erorr", 3000)
      })

  }

  const deleteUser = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to Login with this Email",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          setLoading(true)
          axios.delete(`/user/${authData.id}`, {
            headers: {
              Accept: "application/json",
              "content-type": "application/json",
              Authorization: `Bearer ${authData.token}`
            }
          })
          setLoading(false)
          swal("You Account has beed Deleted", {
            icon: "success",
            buttons: true
          })
            .then(() => {
              setRedirectToReferer(true)
            });
          localStorage.removeItem("jwt")
        }
      });
  }

  const addPost = (formData) => {
    setLoading(true)
    axios
      .post(`/post/new/${authData.id}`, formData, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      })
      .then((res) => {
        swal("Done", res.data.message, "success");
        setLoading(false)
        return true
      })
      .catch(() => {
        setLoading(false)
        swal("Error", "something went wrong", "error")
      });
  }

  const editPost = (id, formData) => {
    setLoading(true)
    axios
      .put(`${process.env.REACT_APP_API_URL}/post/${id}`, formData, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      })
      .then(() => {
        setLoading(false)
        swal("Done", "Updated Successfully", "success")
      })
      .catch(() => {
        setLoading(false)
        swal("fail", "Something went wrong", "error")
      });
  }

  const followUser = (followId, setFollowing) => {
    axios.put('/user/follow', {
      followId: followId,
      userId: authData.id
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    }
    )
      .catch(e => {
        setFollowing(false)
        swal("Error", "Somrthing went wrong", "error")
      })
  }

  const unfollowUser = (unfollowId, setFollowing) => {
    axios.put('/user/unfollow', {
      unfollowId: unfollowId,
      userId: authData.id
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    }
    )
      .catch(e => {
        setFollowing(true)
        swal("Error", "Somrthing went wrong", "error")
      })
  }

  const likePost = (postId, setLike) => {
    setLike(true)
    axios.put('/like', {
      postId: postId,
      userId: authData.id
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    })
      .catch(e => setLike(false))
  }

  const unlikePost = (postId, setLike) => {
    setLike(false)
    axios.put('/unlike', {
      postId: postId,
      userId: authData.id
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    })
      .catch(e => setLike(true))
  }

  const postComment = (postId, comment, setCommentWaiting) => {
    axios.put('/comment', {
      comment: { text: comment },
      userId: authData.id,
      postId: postId
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    })
      .then(() => {
        setCommentWaiting(false)
      })
      .catch(e => {
        setCommentWaiting(false)
        console.log(e);
      })
  }

  const deleteComment = (postId, cId) => {
    axios.put('/uncomment', {
      comment: { _id: cId },
      userId: authData.id,
      postId: postId
    }, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`,
      },
    })
      .catch(e => {
        console.log(e);
      })
  }

  const deletePost = (id) => {
    setLoading(true)
    axios.delete(`/post/${id}`, {
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${authData.token}`
      }
    })
      .then(() => {
        setLoading(false)
        swal("Post Deleted Successfully ", {
          icon: "success",
          buttons: true
        })
      })
      .catch(() => {
        setLoading(false)
        swal("You're not Authorized", {
          icon: "error",
          buttons: true
        })
      })
  }

  const forgotPassword = (email) => {
    setLoading(true)
    axios.put('/forgot-password', { 'email': email })
      .then(res => {
        setLoading(false)
        setForgotPass(email)
      })
      .catch(e => {
        setLoading(false)
        setForgotPass(false)
        swal("Error", e.response.data.error, "error");
      })
  }

  const resetPassword = (token, newPassword) => {
    setLoading(true)
    axios.put('/reset-password', { 'resetPasswordLink': token, 'newPassword': newPassword })
      .then(res => {
        setLoading(false)
        swal("Done", res.data.message, "success")
      })
      .catch((e) => {
        setLoading(false)
        swal("fail", e.response.data.error, "error")
      })
  }

  const logout = () => {
    setLoading(true)
    axios
      .get("/signout")
      .then((res) => {
        setRedirectToReferer(true);
        setProfileData({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          date_of_birth: "",
          phone_no: "",
          address: {
            city: "",
            state: "",
            country: "",
          },
          designation: "",
          website: "",
          contentType: "",
          followers: [],
          following: []
        })
        setLoading(false)
        setAuthData([])
        if (typeof window !== "undefined") localStorage.removeItem("jwt");
      })
      .catch((e) => {
        setLoading(false)
        swal("Logout", "Something Went Wrong", "warning")
      });
  }

  const profileImageCheck = (id) => {
    const userImage = `${process.env.REACT_APP_API_URL}/user/photo/${id}`

    var http = new XMLHttpRequest();
    http.open('HEAD', userImage, false);
    http.send();

    if (http.status != 404) return `${process.env.REACT_APP_API_URL}/user/photo/${id}`
    else return avatar
  }

  useEffect(() => {
    if (typeof window == 'undefined') {
      setAuthData(false);
    }
    if (localStorage.getItem("jwt")) {
      setAuthData({
        id: JSON.parse(localStorage.getItem("jwt")).user._id,
        email: JSON.parse(localStorage.getItem("jwt")).user.email,
        token: JSON.parse(localStorage.getItem("jwt")).token,
      });
    }
  }, []);

  //set Profile Data
  useEffect(() => {
    if (authData) {
      setLoading(true)
      axios.get(`/user/${authData.id}`, {
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        }
      })
        .then(res => {
          const data = res.data
          setProfileData({
            id: data._id,
            firstName: data.name.first_name,
            lastName: data.name.last_name,
            email: data.email,
            username: data.username,
            designation: data.designation,
            address: {
              city: data.address.city,
              state: data.address.state,
              country: data.address.country,
            },
            website: data.website,
            phone_no: data.phone_no,
            date_of_birth: data.date_of_birth,
            contentType: data.profile_image.contentType,
            followers: data.followers,
            following: data.following
          });
          setLoading(false)
        })
        .catch(() => {
          setRedirectToReferer(true)
          setLoading(false)
        })

      axios
        .get(`/post/by/${authData.id}`, {
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        })
        .then((res) => {
          setCurrentUserPost(res.data);
        })
    }

    const userPicture = () => {
      const userImage = `${process.env.REACT_APP_API_URL}/user/photo/${authData.id}`
      var http = new XMLHttpRequest();
      http.open('HEAD', userImage, false);
      http.send();
      if (http.status != 404) {
        setProfileImage(userImage);
      } else setProfileImage(avtar);
    }
    if (authData) userPicture()

  }, [authData, redirectToReferer]);

  const value = {
    authData,
    login,
    signup,
    profileData,
    redirectToReferer,
    currentUserPost,
    deleteUser,
    deletePost,
    addPost,
    editPost,
    editProfile,
    forgotPassword,
    forgotPass,
    resetPassword,
    logout,
    profileImage,
    followUser,
    unfollowUser,
    profileImageCheck,
    likePost,
    unlikePost,
    postComment,
    deleteComment,
    updatePassword,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Spinner /> : null}
      <NotificationContainer />
      {props.children}
    </AuthContext.Provider>
  );
};

export const currentUser = () => {
  if (typeof window == undefined) return false

  if (localStorage.getItem("jwt")) return true;
  else return false
};

export default AuthProvider;
