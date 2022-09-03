import React, { useEffect, useState } from 'react';
import './UserList.css'
import { useAuth } from '../../AuthContext/AuthContext';
import UserTable from '../UserTable';

const FollowersList = () => {
    const [userList, setuserList] = useState([]);
    const { profileData } = useAuth();

    useEffect(() => {
        setuserList(profileData.followers)
    }, [profileData]);

    return (
        <div className="ontainer-fluid px-4">
            <div className='user-list-card'>
                <UserTable userList={userList} cardTitle="Followers List" />
            </div>
        </div>
    );
}

export default FollowersList;