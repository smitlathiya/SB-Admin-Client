import React, { useState } from 'react';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/PanelElement/Dashboard';
import Footer from './Components/Footer';
import { Route, Routes } from 'react-router-dom';
import AddPost from './Components/PanelElement/AddPost';
import Profile from './Components/PanelElement/Profile';
import UserList from './Components/PanelElement/FollowersList';
import Following from './Components/PanelElement/Following';
import EditProfile from './Components/PanelElement/EditProfile';
import UserProfile from './Components/PanelElement/UserProfile';
import EditPost from './Components/PanelElement/EditPost';
import Message from "./Components/PanelElement/Message";
import "./Mainpanel.css"

const Mainpanel = () => {

    const [menuBtn, setMenuBtn] = useState(false);

    return (
        <div className={menuBtn ? 'sb-sidenav-toggled' : null}>
            <Header click={() => setMenuBtn(!menuBtn)} />
            <div id='layoutSidenav'>
                <Sidebar />
                <div id="layoutSidenav_content" style={{ paddingTop: "1.5rem" }}>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/addpost" element={<AddPost />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/userlist" element={<UserList />} />
                        <Route path="/message" element={<Message />} />
                        <Route path="/following" element={<Following />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/userprofile/:userId" element={<UserProfile />} />
                        <Route path="/editpost/:postId" element={<EditPost />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Mainpanel;