import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import React from 'react';

const DeleteUser = () => {
    const { redirectToReferer, deleteUser } = useAuth();

    let redirect = null;

    if (redirectToReferer) {
        redirect = <Navigate to='/signin' />
    }

    return (
        <button className='btn btn-danger' onClick={() => deleteUser()}>{redirect}Delete Account</button>
    );
}

export default DeleteUser;