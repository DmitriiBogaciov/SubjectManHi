import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Button from './Button';
import Profile from './Profile';
import { Modal, Form } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const Navigation = () => {

    const [showTokenModal, setShowTokenModal] = useState(false);
    const [token, setToken] = useState("");

    const { logout, loginWithRedirect, isAuthenticated, getAccessTokenSilently, user } = useAuth0();

    const handleShowToken = () => { console.log("yo"); setShowTokenModal(true) };
    const handleCloseToken = () => setShowTokenModal(false);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();

                const userProfile = await user;
                const userId = user.sub;
                console.log(userProfile);
                console.log(userId);

                setToken(accessToken);
            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const onClickLogIn = () => {
        loginWithRedirect()
    }
    const onClickLogOut = () => {
        logout({ logoutParams: { returnTo: window.location.origin } })
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md" className='p-4 flex'>
                <Nav className="flex justify-between  w-[100%]">

                    <NavLink to="/" className={"no-underline text-white text-3xl p-2"}>
                        <span className='text-2xl'>SubjectMan</span>
                    </NavLink>
                    <div className='flex'>

                        <div className='flex justify-end  pr-4'>
                            <Profile />
                        </div>
                        {isAuthenticated && (
                            <div className='m-auto pl-2 pr-2'>

                                <Button
                                    text="Show Token"
                                    handleOnClick={handleShowToken}
                                >
                                    Show Token
                                </Button>

                            </div>
                        )}
                        <div className='m-auto'>
                            {
                                (!isAuthenticated) ?
                                    <Button text={"Log In"} handleOnClick={onClickLogIn} type={"Submit"} /> :
                                    <Button text={"Log Out"} handleOnClick={onClickLogOut} type={"Delete"} />
                            }

                        </div>

                    </div>
                </Nav>
            </Navbar>
            <Modal show={showTokenModal} onHide={handleCloseToken}>
                <Modal.Header closeButton>
                    <Modal.Title>Access Token</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formToken">
                            <Form.Label>Token</Form.Label>
                            <Form.Control as="textarea" rows={21} value={token} readOnly />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="Delete" handleOnClick={handleCloseToken} text="Close" />

                </Modal.Footer>
            </Modal>
        </>

    );
};

export default Navigation;
