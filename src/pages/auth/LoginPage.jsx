// =========================================
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import { updateSessionToken } from "../../apis/apiAxiosFetch.jsx";

import SessionTimeoutModal from '../../components/modals/SessionTimeoutModal.jsx';
import NavigationPanelHome from '../../components/navs/NavigationPanelHome.jsx';

import { onFacebookAuthPrompt, onGoogleAuthPrompt } from '../../apis/authAPIHandler.jsx';
import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';
import { errorNoAuthEventName } from '../../data/error-loggers.js';
import { login } from '../../feature/activeUser/activeUserSlice.jsx';

import googleIcon from '../../assets/images/auth/google.webp';
import './LoginPage.css';
// =========================================
export default function LoginPage() {
    // ====================
    const navigate = useNavigate();
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
    return (
        <>
            <NavigationPanelHome bgColor="#222222" />
            <Container className="authentication-container mt-5" fluid style={{ flex: 1 }}>
                <Row style={{ minHeight: "80vh" }}>
                    {/* --------------------------------------------- */}
                    {/* Left-side of the Login Page -> Header */}
                    <LoginHeader />
                    {/* --------------------------------------------- */}
                    {/* Right-side of the Login Page -> Credentials Form */}
                    <LoginForm navigate={navigate} />
                    {/* --------------------------------------------- */}
                </Row>
            </Container>
            <SessionTimeoutModal show={timeoutModalShow} onCloseModalCallback={onHideTimeoutModal} />
        </>
    );
}

function LoginHeader() {
    return (
        <Col className="col-6 d-md-flex d-none align-items-center justify-content-center">
            <Col className="col-8">
                <p className="fs-3 fw-bold login-header my-0 py-0">
                    TO ACCESS OUR PLATFORM SERVICES, PLEASE SIGN IN
                </p>
                <br />
                <p className="fs-6 login-header my-0 py-0">
                    Sign in with either your credentials or any of the supported social providers to
                    gain access of the user dashboard.
                </p>
            </Col>
        </Col>
    );
}

function LoginForm({ navigate }) {
    // ====================
    const dispatch = useDispatch();
    // ====================
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordFieldRef = useRef();
    const onChangePasswordVisibility = () => {
        const newState = !showPassword;
        setShowPassword(newState);

        passwordFieldRef.current.type = newState ? "text" : "password";
    }

    const [errorMessage, setErrorMessage] = useState("");
    // ====================
    // Login
    const onLogin = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        onLoadingStart("Global");

        // Debug
        //console.log("Login Event");
        dispatch(login({ email, password })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.payload.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Login Failed] Payload.", action.payload)

                    onFailedLoginCallback(action.payload.error, null);
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

    const onSocialLogin = (platformName, providerId, user) => {
        onLoadingStart("Global");

        dispatch(login({
            email: user.email,
            social_provider: providerId,
            social_uid: user.uid,
            social_access_token: user.accessToken,
            social_refresh_token: user.refreshToken
        })).then((action) => {
            // On Promise Rejected/Failed, Error Exception.
            if (action.payload.error) {
                onLoadingEnd("Global");

                // Debug
                //console.log(`[Login Failed] Payload - ${platformName}.`, action.payload);

                onFailedLoginCallback(action.payload.error, {
                    email: user.email,
                    name: user.displayName,
                    image: user.photoURL,
                    socialProvider: providerId,
                    socialUID: user.uid,
                    socialPlatform: platformName
                });
            }
            // On Promise Fulfilled
            else {
                // Debug
                //console.log(`[Login Successful] Payload - ${platformName}.`, action.payload);

                updateSessionToken(user.accessToken);
                onSuccessfulLoginCallback(user.accessToken);
            }
        });
    };

    const onSocialLoginFailed = (errorCode) => {
        // Handling different error cases.
        switch (errorCode) {
            // User already signed in with a different platform/credential.
            case "auth/account-exists-with-different-credential":
                setErrorMessage("User already exists with a different login method. Please try again with a different approach.");
                break;
            case "auth/cancelled-popup-request":
            default:
        }
    };

    const onLoginGoogle = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        onGoogleAuthPrompt(
            // On Successful Callback
            (result) => onSocialLogin("Google", result.providerId, result.user),
            // On Failed Callback
            onSocialLoginFailed
        );
    }
    // ====================
    const onLoginFacebook = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        onFacebookAuthPrompt(
            // On Successful Callback
            (result) => onSocialLogin("Facebook", result.providerId, result.user),
            // On Failed Callback
            onSocialLoginFailed
        );
    }
    // ====================
    const onSuccessfulLoginCallback = (token) => {
        localStorage.setItem("session-id-ror-event-host", token);
        navigate("/dashboard");
    };

    const onFailedLoginCallback = (error, user = null) => {
        // Debug
        //console.log("[On Login Failed] Error.", error);

        switch (error.code) {
            case "no-user-found":
                navigate("/register", user ? { state: { ...user } } : null);
                break;
            case "incorrect-login-method":
                setErrorMessage("User already exists with a different login method. Please try again with a different approach.");
                break;
            case "incorrect-credentials":
                setErrorMessage("Incorrect email/password combination.");
                break;
        }
    };
    // ====================
    const onMoveToRegistration = () => navigate("/register");
    const onMoveToForgetPassword = () => navigate("/password/forget");
    // ====================
    return (
        <Col className="col-md-6 col-12 d-flex flex-column align-items-center justify-content-center">
            <Card className="login-form-card" style={{ minWidth: "15em" }}>
                <Card.Header className="d-flex flex-column align-items-center">
                    <p className="fs-5 fw-bold text-center my-0 py-0">
                        WELCOME <br />
                        <span className="fs-6 fw-normal login-header text-center my-0 py-0">Access your account here</span>
                    </p>
                </Card.Header>
                <Card.Body className="mx-5">
                    <Form onSubmit={onLogin}>
                        {/* Credential: Email */}
                        <div className="d-flex mb-2 mt-3">
                            <Form.Label htmlFor="email" />
                            <Form.Control id="email" required autoComplete="true"
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        {/* Credential: Password */}
                        <div className="d-flex mb-2">
                            <Form.Label htmlFor="password" />
                            <Form.Control id="password" required autoComplete="true"
                                ref={passwordFieldRef}
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <Button variant="link" className="login-header" onClick={onChangePasswordVisibility}>
                                <i className={`bi bi-eye-${showPassword ? "fill" : "slash-fill"}`}></i>
                            </Button>
                        </div>

                        {/* Login Error Message Log */}
                        {
                            errorMessage ? (
                                <div className="d-flex mb-2">
                                    <p className="text-danger" style={{ fontSize: "0.8em" }}>• {errorMessage}</p>
                                </div>
                            ) : null
                        }

                        {/* Terms of Service */}
                        <div className="mb-3">
                            <p className="fs-6 login-header text-center">
                                By clicking the Login button, you agree to our<br />
                                <a href="#" className="fs-6 fw-bold login-header login-link text-center">Terms of Service</a>
                                <span className="fs-6 login-header text-center">.</span>
                            </p>
                        </div>

                        {/* Login/Submit Button */}
                        <div className="d-flex mb-3 justify-content-center">
                            <Button type="submit" className="w-100">
                                Login
                            </Button>
                        </div>

                        {/* Register Button */}
                        <div className="d-flex justify-content-center">
                            <Button variant="link" onClick={onMoveToRegistration} className="login-link w-100">
                                Are you new here? Click here to create a new account.
                            </Button>
                        </div>

                        {/* Forget Password Button */}
                        <div className="d-flex mb-3 justify-content-center">
                            <Button variant="link" onClick={onMoveToForgetPassword} className="login-link w-100">
                                Forgot your password?
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
                <Card.Footer className="d-flex flex-column align-items-start justify-content-center">
                    <p className="fs-6 login-header text-center">
                        List of Supported Social Providers to sign in with:
                    </p>
                    <div className="d-flex w-100 justify-content-evenly">
                        <Button className="google-container me-3" onClick={onLoginGoogle}>
                            <Image src={googleIcon}
                                style={{
                                    minWidth: "16px", minHeight: "16px", maxWidth: "32px", maxHeight: "32px",
                                    width: "100%", height: "auto"
                                }}
                            />
                            <span> </span>
                            <span className="text-dark">Google</span>
                        </Button>
                        <Button className="facebook-container me-3" onClick={onLoginFacebook}>
                            <i className="bi bi-facebook"></i>
                            <span> </span>
                            <span className="text-light">Facebook</span>
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    );
}
// =========================================