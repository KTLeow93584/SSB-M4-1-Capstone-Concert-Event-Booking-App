
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

import logoImage from '../assets/images/logo.webp';
import defaultProfileImage from '../assets/images/user-profile-default.webp';
// =========================================
export default function NavigationPanel() {
    // ================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ================
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
    // ================
    const user = useSelector((state) => state.activeUser.user);
    // ================
    useEffect(() => {
        const onUserIdentifiedCallback = (event) => dispatch(updateActiveUser(event.detail));
        window.addEventListener("User Identified", onUserIdentifiedCallback);

        return (() => {
            window.removeEventListener("User Identified", onUserIdentifiedCallback);
        });
    }, [dispatch]);
    // ================
    const onLoginCallback = () => navigate("/login");
    const onMoveToProfilePage = () => navigate("/profile");
    // ================
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
                            <>
                                <Image src={defaultProfileImage} onClick={onMoveToProfilePage}
                                    className="me-3"
                                    style={{
                                        minWidth: "24px", minHeight: "24px", maxWidth: "36px", maxHeight: "36px",
                                        width: "100%", height: "auto", cursor: "pointer"
                                    }}
                                />
                                <p className="my-0 py-0">
                                    Welcome, <Link to={"/profile"} className="fw-bold nav-panel-link">{user.name}</Link>
                                </p>
                            </>
                        ) : null
                    }
                    {
                        user ? (
                            <Button variant="link" className="nav-panel-link"
                                onClick={onLogoutCallback}>
                                Logout
                            </Button>
                        ) : (
                            <Button variant="link" className="nav-panel-link"
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