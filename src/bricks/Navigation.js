import React from 'react';
import {NavLink} from 'react-router-dom';
import { Navbar, Nav} from 'react-bootstrap';
import LoginButton from '../LoginButton';
import LogoutButton from '../LogoutButton';
import Profile from '../Profile';

const Navigation = () => {
    return (

        <Navbar bg="dark" variant="dark" expand="md">
            <Nav className="ml-auto">
                <NavLink to="/" className="nav-link">
                    SubjectMan
                </NavLink>
                <div className="nav-link">
                    <LoginButton />
                </div>
                <div className="nav-link">
                    <LogoutButton />
                </div>
                <div className="nav-link">
                    <Profile />
                </div>
            </Nav>
        </Navbar>

    );
};

export default Navigation;
