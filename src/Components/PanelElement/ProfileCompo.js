import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../AuthContext/AuthContext';
import { Link } from 'react-router-dom';
import DeleteUser from '../DeleteUser';
import axios from 'axios';
import swal from 'sweetalert';
import UserImg from "../../assets/avatar.png";
import Postcard from '../Postcard';
import { Country, State, City } from 'country-state-city';

const ProfileCompo = (props) => {
    const { authData, followUser, unfollowUser, profileImageCheck } = useAuth();
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userFound, setUserFound] = useState(true);
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
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
        following: [],
        followers: [],
        id: ''
    });
    const [profileImage, setProfileImage] = useState(UserImg);

    useEffect(() => {
        setLoading(true)
        if (authData) {
            axios
                .get(`/user/${props.id}`, {
                    headers: {
                        Accept: "application/json",
                        "content-type": "application/json",
                        Authorization: `Bearer ${authData.token}`,
                    },
                })
                .then((res) => {
                    const data = res.data;
                    setProfileData({
                        firstName: data.name.first_name,
                        lastName: data.name.last_name,
                        email: data.email,
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
                        username: data.username,
                        following: data.following,
                        followers: data.followers,
                        id: data._id
                    });
                    axios
                        .get(`/post/by/${props.id}`, {
                            headers: {
                                Accept: "application/json",
                                "content-type": "application/json",
                                Authorization: `Bearer ${authData.token}`,
                            },
                        })
                        .then(pst => {
                            setPosts(pst.data)
                            setLoading(false)
                        })
                        .catch(() => {
                            setLoading(false)
                            swal("Error", "Somrthing wrong in post loading", "error");
                        })
                })
                .catch((e) => {
                    setLoading(false)
                    setUserFound(false);
                    swal("Error", "User Not Found", "error");
                });
        }
    }, [authData]);

    useEffect(() => {
        console.log();
        profileData.followers.find(flwrs => {
            flwrs._id === authData.id ? setFollowing(true) : setFollowing(false)
        })
        setProfileImage(profileImageCheck(profileData.id))

    }, [profileData]);

    if (userFound) {
        return (
            <div>
                <div className="container-fluid px-4">
                    {loading ? (<Row>
                        <Col md='4'>
                            <div className="ph-item">
                                <div className="ph-col-4">
                                    <div className="ph-avatar"></div>
                                </div>
                                <div className="ph-col-12">
                                    <div className="ph-row">
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md='8'>
                            <div className="ph-item">
                                <div className="ph-col-12">
                                    <div className="ph-row">
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="ph-item">
                                <div className="ph-col-12">
                                    <div className="ph-row">
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                        <div className="ph-col-4"></div>
                                        <div className="ph-col-12 empty"></div>
                                        <div className="ph-col-2"></div>
                                        <div className="ph-col-12"></div>
                                        <div className="ph-col-4"></div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>) : (<div className="container">
                        <div className="main-body">
                            <Row className="gutters-sm">
                                <Col md='4' className="mb-3">
                                    <Card>
                                        <Card.Body>
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <img
                                                    src={profileImage}
                                                    alt="Admin"
                                                    className="rounded-circle profile-img"
                                                    width="150"
                                                />
                                                <div className="mt-3">
                                                    <h4>
                                                        @{profileData.username}
                                                    </h4>
                                                    <p className="text-secondary">
                                                        {profileData.designation}
                                                    </p>
                                                </div>
                                                <div className="follow-wrapper">
                                                    <p>{profileData.following.length} Following</p>
                                                    <p>{profileData.followers.length} Followers</p>
                                                </div>
                                                {props.isCurrentUser ? null : (<div>
                                                    {following ? (<Button variant="secondary" onClick={() => {
                                                        setFollowing(false)
                                                        unfollowUser(props.id)
                                                    }}>Unfollow</Button>) : (<Button variant="primary" onClick={() => {
                                                        setFollowing(true)
                                                        followUser(props.id)
                                                    }}>Follow</Button>)}
                                                </div>)}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <Card className="mt-3">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                <h6 className="mb-0">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-globe mr-2 icon-inline"
                                                    >
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                    </svg>
                                                    Website
                                                </h6>
                                                <span className="text-secondary">
                                                    {profileData.website ? profileData.website : "N/A"}
                                                </span>
                                            </li>
                                        </ul>
                                    </Card>
                                </Col>
                                <Col md='8'>
                                    <Card className="mb-3">
                                        <Card.Header> Personal Information </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm='3'>
                                                    <h6 className="mb-0">Full Name</h6>
                                                </Col>
                                                <Col sm='9' className="text-secondary">
                                                    {profileData.firstName} {profileData.lastName}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col sm='3'>
                                                    <h6 className="mb-0">Email</h6>
                                                </Col>
                                                <Col sm='9' className="text-secondary">
                                                    {profileData.email}
                                                </Col>
                                            </Row>
                                            {profileData.phone_no && profileData.phone_no !== 'undefined' ? (
                                                <>
                                                    <hr />
                                                    <Row>
                                                        <Col sm='3'>
                                                            <h6 className="mb-0">Mobile Number</h6>
                                                        </Col>
                                                        <Col sm='9' className="text-secondary">
                                                            +{profileData.phone_no}
                                                        </Col>
                                                    </Row>
                                                </>
                                            ) : null}

                                            {profileData.address.city &&
                                                profileData.address.state &&
                                                profileData.address.country ? (
                                                <>
                                                    <hr />
                                                    <Row>
                                                        <Col sm='3'>
                                                            <h6 className="mb-0">Address</h6>
                                                        </Col>
                                                        <Col sm='9' className="text-secondary">
                                                            {profileData.address.city},{" "}
                                                            {State.getStateByCodeAndCountry(profileData.address.state, profileData.address.country).name},{" "}
                                                            {Country.getCountryByCode(profileData.address.country).name}
                                                        </Col>
                                                    </Row>
                                                </>
                                            ) : null}

                                            {profileData.date_of_birth ? (
                                                <>
                                                    <hr />
                                                    <Row>
                                                        <Col sm='3'>
                                                            <h6 className="mb-0">Birth Date</h6>
                                                        </Col>
                                                        <Col sm='9' className="text-secondary">
                                                            {profileData.date_of_birth}
                                                        </Col>
                                                    </Row>
                                                </>
                                            ) : null}
                                            <hr />
                                            <div className="row">
                                                {props.isCurrentUser ? (<div className="col-sm-12">
                                                    <Link className="btn btn-primary" to="/profile/edit">
                                                        Edit
                                                    </Link>{" "}
                                                    <DeleteUser />
                                                </div>) : null}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <Card className="mb-3">
                                        <Card.Header>
                                            Your Posts
                                        </Card.Header>
                                        <Card.Body>
                                            {posts.length > 0 ? posts.map((data) => {
                                                return (
                                                    <Postcard
                                                        postData={data}
                                                        key={data._id}
                                                        photoUrl={
                                                            data.photo
                                                                ? `${process.env.REACT_APP_API_URL}/post/img/${data._id}`
                                                                : null
                                                        }
                                                        menu={true}
                                                        deletePostHandle={(id) => {
                                                            const newPost = posts.filter(data => data._id !== id)
                                                            setPosts(newPost)
                                                        }}
                                                    />
                                                );
                                            }) : <Alert variant='secondary'>No Post</Alert>}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>)}
                </div>

            </div>
        );
    }
}

export default ProfileCompo;
