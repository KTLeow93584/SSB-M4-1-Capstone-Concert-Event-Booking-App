// =========================================
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import { updateSessionToken } from "../apis/authApi.jsx";

import SessionTimeoutModal from '../components/SessionTimeoutModal.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
import { errorNoAuthEventName } from '../data/error-loggers.js';
import { login, register } from '../feature/activeUser/activeUserSlice.jsx';
// =========================================
export default function AuthPage() {
    // ====================
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth();
    // ====================
    // Modal for when error 401's show up -> Return to login page (unauthorized).
    const [timeoutModalShow, setTimeoutModalShow] = useState(false);

    const onHideTimeoutModal = () => setTimeoutModalShow(false);

    // Verify Access Token at the beginning of the app.
    useEffect(() => {
        const onShowTimeoutModal = () => setTimeoutModalShow(true);

        window.addEventListener(errorNoAuthEventName, onShowTimeoutModal);

        return (() => {
            window.removeEventListener(errorNoAuthEventName, onShowTimeoutModal);
        });
    }, [navigate]);
    // ====================
    const [isRegistration, setIsRegistration] = useState(false);
    const [email, setEmail] = useState("");

    const countryCodes = [
        {
            id: 1,
            text: "Malaysia (+60)",
            value: "+60"
        },
        {
            id: 2,
            text: "Singapore (+65)",
            value: "+65"
        },
        {
            id: 3,
            text: "Indonesia (+62)",
            value: "+62"
        },
        {
            id: 4,
            text: "Thailand (+66)",
            value: "+66"
        }
    ];
    const [countryCodeIndex, setCountryCodeIndex] = useState(0);
    const [contactNumber, setContactNumber] = useState("");

    const [password, setPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // ====================
    const onSelectCountryCode = (eventKey) => setCountryCodeIndex(eventKey);
    // ====================
    // Registration
    const onRegister = async (event) => {
        event.preventDefault();
        onLoadingStart("Global");

        // Debug
        //console.log("Sign Up Event");
        dispatch(register({
            email, country_id: countryCodes[countryCodeIndex].id, contact_number: contactNumber, password,
            first_name: firstName, last_name: lastName
        })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Registration Failed] Payload.", action.payload);
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    //console.log("[On Registration Successful] Payload.", action.payload);

                    onLoadingEnd("Global");
                    //setAuthModalShow(null);
                    //setActionCompletedMessage("Successfully Registered. You can now log in!");

                    setEmail("");
                    setPassword("");

                    setContactNumber("");
                    setCountryCodeIndex(0);

                    setFirstName("");
                    setLastName("");

                    setIsRegistration(false);
                }
            }
        );
    }
    // ====================
    // Login
    const onLogin = async (event) => {
        event.preventDefault();
        onLoadingStart("Global");

        // Debug
        //console.log("Login Event");
        dispatch(login({ email, password })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Login Failed] Payload.", action.payload)
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Login Successful] Payload.", action.payload);

                    if (action.payload.client_data) {
                        updateSessionToken(action.payload.client_data.token);
                        onSuccessfulLoginCallback(action.payload.client_data.token);
                    }
                }
            }
        );
    }

    const googleProvider = new GoogleAuthProvider();
    const onLoginGoogle = async (event) => {
        event.preventDefault();
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // Debug
        //console.log("[On Google Login Successful] User.", user);
        onLoadingStart("Global");

        dispatch(login({
            email: user.email,
            social_name: user.displayName,
            social_provider: res.providerId,
            social_uid: user.uid,
            social_profile_image: user.photoURL
        })).then((action) => {
            // On Promise Rejected/Failed, Error Exception.
            if (action.error) {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Login Failed] Payload - Google.", action.payload);
            }
            // On Promise Fulfilled
            else {
                // Debug
                console.log("[Login Successful - Google] Payload.", action.payload);

                updateSessionToken(user.accessToken);
                onSuccessfulLoginCallback(user.accessToken);
            }
        });
    }
    // ====================
    const facebookProvider = new FacebookAuthProvider();
    const onLoginFacebook = async (event) => {
        event.preventDefault();
        const res = await signInWithPopup(auth, facebookProvider);
        const user = res.user;

        // Debug
        //console.log("[On Facebook Login Successful] User.", user);
        onLoadingStart("Global");

        dispatch(login({
            email: user.email,
            social_name: user.displayName,
            social_provider: res.providerId,
            social_profile_image: user.photoURL
        })).then((action) => {
            // On Promise Rejected/Failed, Error Exception.
            if (action.error) {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Login Failed - Facebook] Payload.", action.payload);
            }
            // On Promise Fulfilled
            else {
                // Debug
                //console.log("[Login Successful - Facebook] Payload.", action.payload);

                updateSessionToken(user.accessToken);
                onSuccessfulLoginCallback(user.accessToken);
            }
        });
    }
    // ====================
    const onSuccessfulLoginCallback = (token) => {
        localStorage.setItem("session-id-ror-event-host", token);
        navigate("/dashboard");
    };
    // ====================
    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="d-flex flex-column align-items-center justify-content-center col-12 mb-3" style={{ width: "100%" }}>
                        <Form onSubmit={isRegistration ? onRegister : onLogin} style={{ width: "50%" }}>

                            <div className="d-flex mb-2 mt-3">
                                <Form.Label htmlFor="email" className="me-3" style={{ width: "15%" }}>
                                    Email:
                                </Form.Label>
                                <Form.Control id="email" required autoComplete="true"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="d-flex mb-2">
                                <Form.Label htmlFor="password" className="me-3" style={{ width: "15%" }}>
                                    Password:
                                </Form.Label>
                                <Form.Control id="password" required autoComplete="true"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                            {
                                isRegistration ? (
                                    <>
                                        <div className="d-flex mb-2 align-items-center">
                                            <p className="me-3" style={{ width: "15%" }}>
                                                Phone Number:
                                            </p>
                                            <Dropdown id="dropdown-country-code" onSelect={onSelectCountryCode} className="me-3">
                                                <Dropdown.Toggle>
                                                    {countryCodes[countryCodeIndex].value}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {
                                                        countryCodes.map((country, index) => (
                                                            <Dropdown.Item key={`country-code-${index}`}
                                                                eventKey={index}
                                                                active={countryCodes[countryCodeIndex] === country.code}>
                                                                {country.text}
                                                            </Dropdown.Item>
                                                        ))
                                                    }
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <Form.Control id="contact-number" required
                                                type="tel"
                                                value={contactNumber}
                                                onChange={(event) => setContactNumber(event.target.value)}
                                            />
                                        </div>

                                        <div className="d-flex mb-2">
                                            <Form.Label htmlFor="first-name" className="me-3" style={{ width: "15%" }}>
                                                First Name:
                                            </Form.Label>
                                            <Form.Control id="first-name" required
                                                type="text"
                                                value={firstName}
                                                onChange={(event) => setFirstName(event.target.value)}
                                            />
                                        </div>

                                        <div className="d-flex mb-2">
                                            <Form.Label htmlFor="last-name" className="me-3" style={{ width: "15%" }}>
                                                Last Name:
                                            </Form.Label>
                                            <Form.Control id="last-name" required
                                                type="text"
                                                value={lastName}
                                                onChange={(event) => setLastName(event.target.value)}
                                            />
                                        </div>
                                    </>
                                ) : null
                            }

                            <div className="d-flex mb-3 justify-content-center">
                                <Button type="submit" className="me-3">
                                    {isRegistration ? "Register" : "Login"}
                                </Button>
                                {
                                    isRegistration ? (
                                        <Button className="me-3" onClick={() => setIsRegistration(false)}>
                                            Switch to Login
                                        </Button>
                                    ) : (
                                        <Button className="me-3" onClick={() => setIsRegistration(true)} >
                                            Switch to Registration
                                        </Button>
                                    )
                                }
                            </div>

                        </Form>
                    </Col>
                    <Col className="col-12 d-flex justify-content-center">
                        <Button className="me-3" onClick={onLoginGoogle}>
                            <i className="bi bi-google"></i> Google
                        </Button>
                        <Button className="me-3" onClick={onLoginFacebook}>
                            <i className="bi bi-facebook"></i> Facebook
                        </Button>
                    </Col>
                </Row>
            </Container>
            <SessionTimeoutModal show={timeoutModalShow} onCloseModalCallback={onHideTimeoutModal} />
        </>
    );
}
// =========================================