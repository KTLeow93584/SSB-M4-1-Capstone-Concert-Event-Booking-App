// =========================================
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

import { callServerAPI } from '../apis/apiAxiosFetch.jsx';
import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';

import crossedImage from "../assets/images/crossed.gif";

import "./ResetPasswordPage.css";
// =========================================
export default function ResetPasswordPage() {
    // ====================
    const params = useParams();
    const token = params.token;
    // ====================
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccessful, setIsSuccessful] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    // ====================
    useEffect(() => {
        if (!token)
            return;

        onLoadingStart("Global");
        callServerAPI("password/reset/verify", "POST", { token: token },
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");
                setIsLoading(false);
                setIsSuccessful(true);

                // Debug
                //console.log("[Verify Password Reset Request Successful] Result.", result);
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");
                setIsLoading(false);

                // Debug
                //console.log("[Verify Password Reset Request Failed] Error.", error);

                onVerifyResetRequestFailed(error);
            }
        );
    }, [token])

    const onVerifyResetRequestFailed = (error) => {
        const errorCode = error.code;

        switch (errorCode) {
            case "invalid-password-reset-request":
                setIsSuccessful(false);
                setErrorMessage("This is an invalid password reset request.")
                break;
            case "expired-password-reset-request":
                setIsSuccessful(false);
                setErrorMessage("The password reset request has already expired. Please send a new request.")
                break;
            default:
        }
    };
    // ====================
    return (
        <Container className="authentication-container" fluid style={{ flex: 1 }}>
            <Row className="mt-5">
                <Col className="col-12 d-flex flex-column align-items-center">
                    {
                        isLoading ? null : (
                            isSuccessful ?
                                <VerifiedResetPasswordComponent token={token} onRequestFailedCallback={onVerifyResetRequestFailed} /> :
                                <UnverifiedResetPasswordComponent errorMessage={errorMessage} />
                        )
                    }
                </Col>
            </Row>
        </Container>
    );
}
// =========================================
function VerifiedResetPasswordComponent({ token, onRequestFailedCallback = null }) {
    // ====================
    const navigate = useNavigate();
    // ====================
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] = useState(false);

    const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
    const [isCorrectPasswordFormat, setIsCorrectPasswordFormat] = useState(true);

    function isPasswordMatched() {
        const match = password === passwordConfirmation;

        setDoPasswordsMatch(match);
        return match;
    }

    function doPasswordsMeetCriteria() {
        const regexUpperLetters = /[A-Z]/;
        const regexLowerLetters = /[a-z]/;
        const regexNumbers = /[0-9]/;
        const regexSymbols = /[^a-zA-z0-9]/;

        const pass = password.length >= 8 & regexUpperLetters.test(password) &
            regexLowerLetters.test(password) & regexNumbers.test(password) &
            regexSymbols.test(password);

        setIsCorrectPasswordFormat(pass);

        return pass;
    }

    const onSubmitPasswordResetRequest = (event) => {
        event.preventDefault();

        const passValidations = isPasswordMatched() & doPasswordsMeetCriteria();
        if (!passValidations)
            return;

        onLoadingStart("Global");

        callServerAPI("password/reset", "POST", { token: token, password: password },
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Reset Account Password Successful] Result.", result);

                alert("Password Reset was successful. You may proceed to login with your new credentials now.");

                navigate("/login");
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Request Password Reset Failed] Error.", error);

                if (onRequestFailedCallback)
                    onRequestFailedCallback(error);
            }
        );
    };
    // ====================
    const onPasswordVisibilityChanged = () => {
        const newState = !isPasswordVisible;
        setIsPasswordVisible(newState);
    };

    const onPasswordConfirmationVisibilityChanged = () => {
        const newState = !isPasswordConfirmationVisible;
        setIsPasswordConfirmationVisible(newState);
    };
    // ====================
    const onMoveToLogin = () => navigate("/login");
    // ====================
    return (
        <>
            <Form onSubmit={onSubmitPasswordResetRequest}>
                <Card style={{ minWidth: "35em" }}>
                    <Card.Header className="d-flex flex-column align-items-center">
                        <p className="fs-5 fw-bold text-center my-0 py-0">
                            Reset Your Password
                        </p>
                    </Card.Header>
                    <Card.Body className="mt-2">
                        {/* ------------------------- */}
                        {/* Password Field */}
                        <Form.Label htmlFor="password">
                            Password*:
                        </Form.Label>
                        <div className="d-flex mb-3">
                            <Form.Control id="password"
                                type={isPasswordVisible ? "text" : "password"} required
                                placeholder="Password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);

                                    if (!isCorrectPasswordFormat)
                                        setIsCorrectPasswordFormat(true);

                                    if (!doPasswordsMatch)
                                        setDoPasswordsMatch(true);
                                }}
                            />
                            <Button variant="link" className="registration-header" onClick={onPasswordVisibilityChanged}>
                                <i className={`bi bi-eye-${isPasswordVisible ? "fill" : "slash-fill"}`}></i>
                            </Button>
                        </div>
                        {/* ------------------------- */}
                        {/* Password Confirmation Field */}
                        <Form.Label htmlFor="password-confirmation">
                            Confirm Your Password*:
                        </Form.Label>
                        <div className="d-flex mb-3">
                            <Form.Control id="password-confirmation"
                                type={isPasswordConfirmationVisible ? "text" : "password"} required
                                placeholder="Password Confirmation"
                                value={passwordConfirmation}
                                onChange={(event) => {
                                    setPasswordConfirmation(event.target.value);

                                    if (!isCorrectPasswordFormat)
                                        setIsCorrectPasswordFormat(true);

                                    if (!doPasswordsMatch)
                                        setDoPasswordsMatch(true);
                                }}
                            />
                            <Button variant="link" className="registration-header" onClick={onPasswordConfirmationVisibilityChanged}>
                                <i className={`bi bi-eye-${isPasswordConfirmationVisible ? "fill" : "slash-fill"}`}></i>
                            </Button>
                        </div>
                        {/* ------------------------- */}
                        {/* Password Criteria */}
                        <div className="d-flex flex-column rounded mb-2 px-2 py-1">
                            <Form.Text className="fw-bold">Requirements for password: </Form.Text>
                            <Form.Text className="fw-normal">1. 8 characters long. </Form.Text>
                            <Form.Text className="fw-normal">2. Must contain 1 symbol, 1 number, 1 lower and 1 uppercase letter. </Form.Text>
                        </div>
                        {/* ------------------------- */}
                        {/* Mismatched Password Error */}
                        {
                            (!doPasswordsMatch) ? (
                                <p className="text-danger ms-1 mt-0 py-0 mb-2" style={{ fontSize: "0.8em" }}>
                                    • Both the Password and Password Confirmation fields do not match
                                </p>
                            ) : null
                        }

                        {/* Password Format */}
                        {
                            (!isCorrectPasswordFormat) ? (
                                <p className="text-danger ms-1 mt-0 py-0 mb-2" style={{ fontSize: "0.8em" }}>
                                    • The current password does not meet the criteria.
                                </p>
                            ) : null
                        }
                        {/* ------------------------- */}
                        {/* Return to Login Page/Remembered Password Button */}
                        <div className="d-flex justify-content-center">
                            <Button type="submit" onClick={onSubmitPasswordResetRequest} className="w-100">
                                Submit
                            </Button>
                        </div>
                        {/* ------------------------- */}
                        {/* Return to Login Page Button */}
                        <div className="d-flex mb-3 justify-content-center">
                            <Button variant="link" onClick={onMoveToLogin} className="reset-password-link w-100">
                                Return to Login Page
                            </Button>
                        </div>
                        {/* ------------------------- */}
                    </Card.Body>
                </Card>
            </Form>
        </>
    );
}
// =========================================
function UnverifiedResetPasswordComponent({ errorMessage }) {
    return (
        <>
            <Image src={crossedImage}
                style={{
                    minWidth: "128px", minHeight: "128px",
                    maxWidth: "256px", maxHeight: "256px",
                    width: "100%", height: "auto"
                }}
            />
            <p className="fs-6 text-danger text-center">
                {errorMessage}
            </p>
        </>
    );
}
// =========================================