import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext/AuthContext';
import UserTable from '../UserTable';

const Following = () => {
    const { profileData } = useAuth();
    const [userList, setuserList] = useState([]);

    useEffect(() => {
        setuserList(profileData.following)
    }, [profileData]);


    return (
        <div className="ontainer-fluid px-4">
            <div className='user-list-card'>
                <UserTable userList={userList} cardTitle="Following List" />
            </div>
        </div>
    );
}

export default Following;