
// =========================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';

import { logout, updateActiveUser } from '../../feature/activeUser/activeUserSlice.jsx';
import { updateSessionToken } from '../../apis/apiAxiosFetch.jsx';

import logoImage from '../../assets/images/logo.webp';

import './NavigationPanelHome.css';
// =========================================
export default function NavigationPanelHome() {
    // ================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ================
    const [optionVisibility, setOptionVisibility] = useState(false);
    const onShowOptions = () => {
        setOptionVisibility(true);
    };

    const onHideOptions = () => {
        setOptionVisibility(false);
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
    return (
        <>
            <div className="nav-panel-container" style={{ zIndex: 4 }}>
                <Container fluid>
                    <Row>
                        <Col className="col-12 d-flex align-items-center">
                            <Image src={logoImage} rounded
                                className="nav-logo"
                                style={{
                                    maxWidth: "256px", maxHeight: "50px",
                                    width: "100%", height: "auto", cursor: "pointer"
                                }} />
                            <Button variant="link" className="nav-panel-link ms-auto"
                                onClick={onShowOptions}>
                                <i className="fs-1 bi bi-justify" />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Offcanvas show={optionVisibility}
                onHide={onHideOptions}
                placement="end"
                name="off-canvas-placement-end"
                data-bs-theme="dark">
                <Offcanvas.Header closeButton />
                <Offcanvas.Body>
                    <ListGroup className="mt-5" style={{ border: "none" }}>
                        <ListGroup.Item action as={Link} to={"/about"}
                            style={{ border: "none" }}>
                            <h2>About Us</h2>
                        </ListGroup.Item>
                        <ListGroup.Item action as={Link} to={"/work"}
                            style={{ border: "none" }}>
                            <h2>Work</h2>
                        </ListGroup.Item>
                        <ListGroup.Item action as={Link} to={"/services"}
                            style={{ border: "none" }}>
                            <h2>Services</h2>
                        </ListGroup.Item>
                        <ListGroup.Item action as={Link} to={"/brands"}
                            style={{ border: "none" }}>
                            <h2>Brand</h2>
                        </ListGroup.Item>
                        <ListGroup.Item action as={Link} to={"/contact"}
                            style={{ border: "none" }}>
                            <h2>Contact</h2>
                        </ListGroup.Item>
                        {
                            user ? (
                                <ListGroup.Item action as={Link} to={"/dashboard"}
                                    style={{ border: "none" }}>
                                    <h2>Dashboard</h2>
                                </ListGroup.Item>
                            ) : null
                        }
                        <ListGroup.Item action onClick={user ? onLogoutCallback : onLoginCallback}
                            style={{ border: "none" }}>
                            <h2>{user ? "Logout" : "Login"}</h2>
                        </ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
// =========================================