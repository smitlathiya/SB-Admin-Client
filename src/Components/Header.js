import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { Button, ListGroup, NavDropdown } from 'react-bootstrap'
import axios from "axios";
import defaultImage from '../assets/avatar.png'

const Header = (props) => {

  const [userList, setUserList] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const { redirectToReferer, logout } = useAuth();

  const dropdownTitle = (<svg
    className="svg-inline--fa fa-user fa-fw"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="user"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
    ></path>
  </svg>)

  const searchHandler = (event) => {
    const value = event.target.value;
    setSearchVal(event.target.value)
    if (value.length > 0) {
      axios.get(`${process.env.REACT_APP_API_URL}/users/search/${value}`)
        .then(res => {
          setUserList(res.data)
        })
    }
    setUserList([])
  }

  let redirect = null;

  if (redirectToReferer) {
    redirect = <Navigate to="/signin" />;
  }

  return (
    <nav className=" sb-topnav navbar navbar-expand navbar-dark">
      {redirect}
      <a className="navbar-brand ps-3" href="#">
        SB Admin
      </a>
      <Button className="btn btn-sm order-1 order-lg-0 me-4 me-lg-0"
        onClick={() => props.click()}>
        <svg
          className="svg-inline--fa fa-bars"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"
          ></path>
        </svg>
      </Button>
      <div className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0" style={{ width: "100%", maxWidth: "330px" }}>
        <div className="input-group">
          <input
            className="form-control"
            type="search"
            placeholder="Search User"
            onChange={searchHandler}
            value={searchVal || ''}
          />
          {searchVal.length != 0 ? (
            <div className="userList">
              <ListGroup>
                {userList.map(data => {
                  return (
                    <Link to={`/userprofile/${data._id}`} className="search-result list-group-item" key={data._id} onClick={() => {
                      setUserList([])
                      setSearchVal('')
                    }}>
                      <div className="user-img">
                        {data.profile_image.contentType ? (<img src={`${process.env.REACT_APP_API_URL}/user/photo/${data._id}`} />) : (<img src={defaultImage} />)}
                      </div>
                      <div className="search-result-name">
                        <span className="user-name">
                          {data.name.first_name} {data.name.last_name}
                        </span>
                        <span>
                          {data.username}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </ListGroup>
            </div>) : null}
        </div>
      </div>

      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <NavDropdown title={dropdownTitle} id="collasible-nav-dropdown">
          <Link className="dropdown-item" to="/profile">
            Profile
          </Link>
          <Link className="dropdown-item" to="/addpost">
            Add Post
          </Link>
          <NavDropdown.Divider />
          <button className="dropdown-item" onClick={logout}>
            Logout
          </button>
        </NavDropdown>
      </ul>
    </nav>
  );
};

export default Header;
