// Profile.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div></div>;
    }

    return (
        isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={user.picture}
                    alt={user.name}
                    style={{ borderRadius: '50%', width: '30px', height: '30px', marginRight: '10px' }}
                />
                <div>
                    <h2 style={{ fontSize: '14px', margin: '0' }}>{user.name}</h2>
                </div>
            </div>
        )
    );
};

export default Profile;
