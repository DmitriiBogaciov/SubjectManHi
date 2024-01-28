import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { Modal, Form } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

//Custom components
import Button from './Button.component.tsx';
import Profile from './Profile.component.tsx';


const MainNavBar = () => {

    const [showTokenModal, setShowTokenModal] = useState(false);
    const [token, setToken] = useState("");

    const { logout, loginWithRedirect, isAuthenticated, getAccessTokenSilently, user } = useAuth0();

    const handleCloseToken = () => setShowTokenModal(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();

                const userProfile = await user;
                //const userId = user.sub;
                console.log(userProfile);
                // console.log(userId);

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
            <Navbar bg="dark" variant="dark" expand="md" className='p-4 flex shadow-sm'>
                <Nav className="flex justify-between  w-[100%]">
                    <NavLink to="/" className={"no-underline text-white text-3xl p-2"}>
                        <span className='text-2xl'>SubjectMan</span>
                    </NavLink>
                </Nav>
                <div className='grid justify-end sm:flex sm:grid-cols-2 grid-cols-1'>
                    <div className='grid grid-cols-2 p-2'>
                        <div className='flex justify-end sm:p-2 p-0 pb-2'>
                            <Profile />
                        </div>
                        <div className='flex justify-end'>
                            {
                                (!isAuthenticated) ?
                                    <Button label={t("login")} on_click_handler={onClickLogIn} type={"Submit"} /> :
                                    <Button label={t("logout")} on_click_handler={onClickLogOut} type={"Delete"} />
                            }
                        </div>
                    </div>
                    <div className='p-0 m-auto flex justify-end'>
                        <Dropdown>
                            <Dropdown.Toggle  className=' bg-button-default ml-2'>
                                {t("langauge.choose")}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <div className='p-2 bg-transparent'>
                                        <Button label={t("langauge.czech")} type='Default' on_click_handler={() => {i18n.changeLanguage("cs")}}></Button>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <div className='p-2'>
                                        <Button label={t("langauge.english")} type='Default' on_click_handler={() => {i18n.changeLanguage("en")}}></Button>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

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

                </Modal.Footer>
            </Modal>
        </>

    );
};

export default MainNavBar;
