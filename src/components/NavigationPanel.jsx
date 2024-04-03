
// =========================================
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';

import { logout, updateActiveUser } from '../feature/activeUser/activeUserSlice.jsx';
import { updateSessionToken } from '../apis/authApi.jsx';

import logoImage from "../assets/images/logo.webp";
// =========================================
export default function NavigationPanel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLoginCallback = () => navigate("/login");

    const onLogoutCallback = () => {
        dispatch(logout()).then(
            // On Promise Fulfilled, clear the token from the local storage.
            () => {
                updateSessionToken("");
                navigate("/login");
            },
            // On Promise Rejected/Failed
            null
        );
    };

    const user = useSelector((state) => state.activeUser.user);

    useEffect(() => {
        const onUserIdentifiedCallback = (event) => dispatch(updateActiveUser(event.detail));
        window.addEventListener("User Identified", onUserIdentifiedCallback);

        return (() => {
            window.removeEventListener("User Identified", onUserIdentifiedCallback);
        });
    }, [dispatch]);

    return (
        <Navbar bg="light">
            <Container fluid>
                <Navbar.Brand as={Link} to={"/"} className="ms-4">
                    <Image src={logoImage} rounded
                        style={{
                            minWidth: "32px", minHeight: "32px", maxWidth: "48px", maxHeight: "48px",
                            width: "100%", height: "auto", cursor: "pointer"
                        }} />
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {
                        user ? (
                            <p className="my-0 py-0">
                                Welcome, {user.first_name + " " + user.last_name}
                            </p>
                        ) : null
                    }
                    {
                        user ? (
                            <Button variant="link"
                                onClick={onLogoutCallback}>
                                Logout
                            </Button>
                        ) : (
                            <Button variant="link"
                                onClick={onLoginCallback}>
                                Login
                            </Button>
                        )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
// =========================================