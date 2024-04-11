// =========================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import { callServerAPI } from '../../apis/apiAxiosFetch.jsx';
import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';

import "./ForgetPasswordPage.css";
// =========================================
export default function ForgetPasswordPage() {
    // ====================
    const navigate = useNavigate();
    // ====================
    const [email, setEmail] = useState("");
    const [isRequestSent, setIsRequestSent] = useState(false);
    // ====================
    const onSubmitPasswordChangeRequest = (event) => {
        event.preventDefault();

        onLoadingStart("Global");

        callServerAPI("password/forget", "POST", { email: email },
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Request Password Reset Successful] Result.", result);

                setIsRequestSent(true);
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Request Password Reset Failed] Error.", error);
            }
        );
    };
    // ====================
    const onMoveToLogin = () => navigate("/login");
    // ====================
    return (
        <Container className="authentication-container" fluid style={{ flex: 1 }}>
            <Row className="mt-5">
                <Col className="col-12 d-flex flex-column align-items-center">
                    <Form onSubmit={onSubmitPasswordChangeRequest}>
                        <Card>
                            <Card.Header className="d-flex flex-column align-items-center">
                                <p className="fs-5 fw-bold text-center my-0 py-0">
                                    Password Change Request (Forgot Password)
                                </p>
                            </Card.Header>
                            <Card.Body className="mt-2">
                                {/* ------------------------- */}
                                {/* Email Field */}
                                <Form.Label htmlFor="email">
                                    Email Address*:
                                </Form.Label>
                                <Form.Control id="email" type="email" required
                                    className="mb-3"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                                {/* ------------------------- */}
                                {/* Return to Login Page/Remembered Password Button */}
                                <div className="d-flex justify-content-center">
                                    <Button type="submit" onClick={onSubmitPasswordChangeRequest} className="w-100">
                                        Request for Password Reset
                                    </Button>
                                </div>
                                {/* ------------------------- */}
                                {/* Return to Login Page/Remembered Password Button */}
                                <div className="d-flex mb-3 justify-content-center">
                                    <Button variant="link" onClick={onMoveToLogin} className="forget-password-link w-100">
                                        Remembered your password?
                                    </Button>
                                </div>
                                {/* ------------------------- */}
                                {/* Notification Text*/}
                                {
                                    isRequestSent ? (
                                        <div className="d-flex mt-3">
                                            <p className="text-success" style={{ fontSize: "0.8em" }}>
                                                • Reset Password Request successfully sent.
                                            </p>
                                        </div>
                                    ) : null
                                }
                                {/* ------------------------- */}
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
// =========================================