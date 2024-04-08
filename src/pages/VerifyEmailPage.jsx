// =========================================
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Image from 'react-bootstrap/Image';

import { callServerAPI } from '../apis/apiAxiosFetch.jsx';
import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';

import checkedImage from "../assets/images/checked.gif";
import crossedImage from "../assets/images/crossed.gif";

import "./VerifyEmailPage.css";
// =========================================
export default function VerifyEmailPage() {
    // ================
    const params = useParams();
    const token = params.token;
    // ================
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccessful, setIsSuccessful] = useState(true);
    const [isRedundant, setIsRedundant] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    // ================
    useEffect(() => {
        if (!token)
            return;

        onLoadingStart("Global");
        callServerAPI("verify", "POST", { token: token },
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");
                setIsLoading(false);
                setIsSuccessful(true);

                // Debug
                //console.log("[Verify User Account's Email Successful] Result.", result);
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");
                setIsLoading(false);

                // Debug
                //console.log("[Verify User Account's Email Failed] Error.", error);

                switch (error.code) {
                    case "verification-not-found":
                        setIsSuccessful(false);
                        setErrorMessage("This is an invalid email verification request.")
                        break;
                    case "user-already-verified":
                        setIsSuccessful(true);
                        setIsRedundant(true);
                        break;
                    default:
                }
            }
        );
    }, [token]);
    // ================
    return (
        <Container className="authentication-container" fluid style={{ flex: 1 }}>
            <Row className="my-5">
                <Col className="col-12 d-flex flex-column align-items-center">
                    {
                        isLoading ? null : (
                            isSuccessful ?
                                <VerifiedComponent isRedundant={isRedundant} /> :
                                <UnverifiedComponent errorMessage={errorMessage} />
                        )
                    }
                </Col>
            </Row>
        </Container>
    );
}

function VerifiedComponent({ isRedundant }) {
    return (
        <>
            <Image src={checkedImage}
                style={{
                    minWidth: "128px", minHeight: "128px",
                    maxWidth: "256px", maxHeight: "256px",
                    width: "100%", height: "auto"
                }}
            />
            <p className="fs-6 text-center">
                {
                    isRedundant ? (
                        <>
                            <span>Your account has already been verified! Do head on over to the </span>
                            <a href="/login" className="description-link" >login</a>
                            <span> page to gain full access of the dashboard.</span>
                            <br />
                            <span><b>Rock On!</b></span>
                        </>
                    ) : (
                        <>
                            <span>Thank you for verifying your email with us! You may now </span>
                            <a href="/login" className="description-link" >login</a>
                            <span> to gain full access of the dashboard.</span>
                            <br />
                            <span><b>Rock On!</b></span>
                        </>
                    )
                }
            </p >
        </>
    );
}

function UnverifiedComponent({ errorMessage }) {
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