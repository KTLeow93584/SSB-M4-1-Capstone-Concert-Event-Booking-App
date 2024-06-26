// =========================================
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';

import { callServerAPI } from '../../apis/apiAxiosFetch.jsx';
import { onFacebookAuthPrompt, onGoogleAuthPrompt } from '../../apis/authAPIHandler.jsx';
import { NavigationPanelHome } from '../../components/navs';
import { onLoadingStart, onLoadingEnd } from '../../data/loaders.js';
import { register } from '../../feature/activeUser/activeUserSlice.jsx';

import googleIcon from '../../assets/images/auth/google.webp';
import "./RegistrationPage.css";
// =========================================
export default function RegistrationPage() {
    return (
        <>
            <NavigationPanelHome bgColor="#222222" />
            <Container className="authentication-container" fluid style={{ flex: 1 }}>
                <Row style={{ marginTop: "108px", marginBottom: "30px" }}>
                    <RegistrationHeader />
                    <RegistrationForm />
                </Row>
            </Container>
        </>
    );
}
// =========================================
function RegistrationHeader() {
    return (
        <Col className="col-6 d-md-flex d-none align-items-center justify-content-center">
            <Col className="col-8">
                <p className="fs-3 fw-bold registration-header my-0 py-0">
                    JOIN US TO ASSIST IN SCHEDULING YOUR EVENTS
                </p>
                <br />
                <p className="fs-6 registration-header my-0 py-0">
                    Sign up with either your credentials or any of the supported social providers, then login to
                    gain access of the user dashboard.
                </p>
            </Col>
        </Col>
    );
}

function RegistrationForm() {
    // ====================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // ====================
    const [isOrganization, setIsOrganization] = useState(false);

    const [organizationName, setOrganizationName] = useState("");
    const [name, setName] = useState((location.state && location.state.name) ? location.state.name : "");
    // ====================
    const [email, setEmail] = useState((location.state && location.state.email) ? location.state.email : "");
    const [countryIndex, setCountryIndex] = useState(0);
    const [contactNumber, setContactNumber] = useState("");

    const [image, setImage] = useState((location.state && location.state.image) ? location.state.image : "");
    const imageRef = useRef();
    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
    const [isCorrectPasswordFormat, setIsCorrectPasswordFormat] = useState(true);

    const [isEmailAlreadyInUse, setIsEmailAlreadyInUse] = useState(false);
    const [isContactNumberAlreadyInUse, setIsContactNumberAlreadyInUse] = useState(false);
    const [isFormIncomplete, setIsFormIncomplete] = useState(false);
    const [isFormAmbiguous, setIsFormAmbiguous] = useState(false);
    const [errorSocialsMessage, setErrorSocialsMessage] = useState("");

    const [smsVerifyModalShow, setSMSVerifyModalShow] = useState(false);
    const onShowSMSVerifyModal = () => setSMSVerifyModalShow(true);
    const onCloseSMSVerifyModal = () => setSMSVerifyModalShow(false);

    const [newUser, setNewUser] = useState(null);
    const [smsVerifyCode, setSMSVerifyCode] = useState("");
    const [emailVerificationState, setEmailVerificationState] = useState(false);

    const [isSocialRegistration, setIsSocialRegistration] = useState(location.state !== null);
    const [socialPlatform, setSocialPlatform] = useState((location.state && location.state.socialPlatform) ? location.state.socialPlatform : "");
    const [socialProvider, setSocialProvider] = useState((location.state && location.state.socialProvider) ? location.state.socialProvider : "");
    const [socialUID, setSocialUID] = useState((location.state && location.state.socialUID) ? location.state.socialUID : "");

    const onSwitchToOrganizationRegistration = () => setIsOrganization(true);
    const onSwitchToIndividualRegistration = () => setIsOrganization(false);

    const onClearSocialRegistration = () => {
        setIsSocialRegistration(false);
        setSocialProvider("");
        setSocialUID("");

        setEmail("");
        setName("");
        setOrganizationName("");
        setImage(null);
        imageRef.current.value = "";
    };
    // ====================
    const [countries, setCountries] = useState([]);
    const onSelectCountry = (eventKey) => setCountryIndex(eventKey);
    // ====================
    const [organizationRegID, setOrganizationRegID] = useState("");
    const [nric, setNRIC] = useState("");
    // ====================
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

    function onNewProfilePictureUploaded(event) {
        const file = event.target.files[0];

        if (!file) {
            setImage(null);
            return;
        }

        // Debug
        //console.log("[On Profile Picture Upload] Size.", file.size);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load", () => {
            const url = fileReader.result;

            // Test for width and height
            const testImg = new window.Image();
            testImg.onload = () => {
                const width = testImg.width;
                const height = testImg.height;

                // Debug
                //console.log("[On Profile Picture Upload] Width: " + width + ", Height: " + height);

                const isValid = width === height & file.size <= 128000;
                setIsCorrectImageFormat(isValid);
                if (isValid)
                    setImage(url);
            }
            testImg.src = url;
        });
    }
    // ====================
    // Registration
    const onRegister = async (event) => {
        event.preventDefault();

        setIsEmailAlreadyInUse(false);

        const passValidations = isPasswordMatched() & doPasswordsMeetCriteria();
        if (!passValidations)
            return;

        onLoadingStart("Global");
        const requestBody = isOrganization ? {
            email, password,
            country_id: countries[countryIndex].id,
            contact_number: contactNumber,
            profile_picture: image,

            // Socials
            social_provider: socialProvider,
            social_uid: socialUID,

            // Organizations/Companies
            organization_name: organizationName,
            organization_registration_number: organizationRegID
        } : {
            email, password,
            country_id: countries[countryIndex].id,
            contact_number: contactNumber,
            profile_picture: image,

            // Socials
            social_provider: socialProvider,
            social_uid: socialUID,

            // Individuals
            name: name,
            nric: nric
        };

        // Debug
        //console.log("Sign Up Event", requestBody);

        dispatch(register(requestBody)).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.payload.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Registration Failed] Payload.", action.payload);
                    onRegisterFailed(action.payload.error);
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    console.log("[On Registration Successful] Payload.", action.payload);

                    onLoadingEnd("Global");

                    if (action.payload.client_data.message) {
                        switch (action.payload.client_data.message) {
                            case "unverified-email":
                                setEmailVerificationState(false);
                                onShowSMSVerifyModal();
                                break;
                        }
                    }

                    setEmailVerificationState(true);
                    onShowSMSVerifyModal();

                    setNewUser(action.payload.client_data.user);
                }
            }
        );
    };

    // Google (Same process as login, first login -> Automatically register)
    const onRegisterGoogle = async (event) => {
        event.preventDefault();
        setErrorSocialsMessage("");

        onGoogleAuthPrompt(
            // On Successful Callback
            (result) => onSocialRegistrationSuccessful("Google", result.user, result.providerId),
            // On Failed Callback
            onSocialRegistrationFailed
        );
    };

    // Facebook (Same process as login, first login -> Automatically register)
    const onRegisterFacebook = async (event) => {
        event.preventDefault();
        setErrorSocialsMessage("");

        onFacebookAuthPrompt(
            // On Successful Callback
            (result) => onSocialRegistrationSuccessful("Facebook", result.user, result.providerId),
            // On Failed Callback
            onSocialRegistrationFailed
        );
    };

    const onSocialRegistrationSuccessful = (socialPlatform, user, providerId) => {
        setEmail(user.email);
        setName(user.displayName);
        setOrganizationName(user.displayName);
        setImage(user.photoURL);

        setSocialProvider(providerId);
        setSocialUID(user.uid);
        setIsSocialRegistration(true);
        setSocialPlatform(socialPlatform);

        setIsEmailAlreadyInUse(false);

        imageRef.current.value = "";
    };

    const onSocialRegistrationFailed = (errorCode) => {
        // Handling different error cases.
        switch (errorCode) {
            // User already signed in with a different platform/credential.
            case "auth/account-exists-with-different-credential":
                setErrorSocialsMessage("User already exists with a different login method. Please try again with a different approach.");
                break;
            case "auth/cancelled-popup-request":
            default:
        }
    };

    const onRegisterFailed = (error) => {
        const errorCode = error.code;

        switch (errorCode) {
            case "incomplete-form":
                setIsFormIncomplete(true);
                break;
            case "ambiguous-registration-type":
                setIsFormAmbiguous(true);
                break;
            case "email-already-in-use":
                setIsEmailAlreadyInUse(true);
                break;
            case "contact-number-already-in-use":
                setIsContactNumberAlreadyInUse(true);
                break;
            case "incorrect-password-format":
                setIsCorrectPasswordFormat(false);
                break;
            default:
        }
    };

    const onSendVerificationSMSPressed = () => {
        callServerAPI("sms/verify", "POST", { user_id: newUser.id, sms_code: smsVerifyCode },
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");

                // Debug
                console.log("[Verify Phone Number API Successful] Result.", result);

                setEmail("");
                setPassword("");
                setPasswordConfirmation("");

                setImage("");

                setContactNumber("");
                setCountryIndex(0);

                setOrganizationName("");
                setName("");

                setOrganizationRegID("");
                setNRIC("")

                alert(emailVerificationState ? "Registration Successful. We've sent an email to your account. Do check and verify to gain access to the dashboard!" :
                    ("Registration Successful. No Email verification is sent due to Mailgun API's free limitations." +
                        " You can now login! Do contact the developer and provide your email to experience the intended registration flow."));
                navigate("/login");
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");

                // Debug
                console.log("[Verify Phone Number API Failed] Error.", error);
            }
        );
    };
    // ====================
    useEffect(() => {
        callServerAPI("countries", "GET", null,
            // On Successful Callback
            (result) => {
                // Debug
                //console.log("[Get Country List Successful] Result.", result);

                setCountries(result.countries);
            },
            // On Failed Callback
            (error) => {
                // Debug
                //console.log("[Get Country List Failed] Error.", error);
            }
        );
    }, []);
    // ====================
    return (
        <>
            <Col className="col-md-6 col-12 d-flex flex-column align-items-center justify-content-center">
                <Card className="registration-form-card" style={{ minWidth: "15em" }}>
                    <Card.Header className="d-flex flex-column align-items-center">
                        <p className="fs-5 fw-bold text-center my-0 py-0">
                            Register a new account here
                            <br />
                            <span className="fs-6 fw-normal registration-header text-center my-0 py-0">
                                And let us help you with arranging your future concert events!
                            </span>
                        </p>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={onRegister}>
                            {/* ------------------------- */}
                            {/* Checkbox -> Organization or Individual Registration */}
                            <div className="d-flex justify-content-evenly mb-2 mt-3 mx-5">
                                <Form.Check
                                    type="radio"
                                    checked={isOrganization}
                                    id="checbox-user-type-organzation"
                                    label="Organization"
                                    onChange={onSwitchToOrganizationRegistration}
                                />
                                <Form.Check
                                    type="radio"
                                    checked={!isOrganization}
                                    id="checbox-user-type-user"
                                    label="Individual"
                                    onChange={onSwitchToIndividualRegistration}
                                />
                            </div>
                            {/* ------------------------- */}
                            {/* Social Platform */}
                            {
                                isSocialRegistration ? (
                                    <>
                                        <hr />
                                        <div className="d-flex align-items-center justify-content-center mb-2 mt-3 mx-5">
                                            <p className="my-0 py-0 me-3">
                                                Linked Social Platform: <b>{socialPlatform}</b>
                                            </p>
                                            <Button onClick={onClearSocialRegistration}>
                                                Reset
                                            </Button>
                                        </div>
                                    </>
                                ) : null
                            }
                            {/* ------------------------- */}
                            <hr />
                            {/* ------------------------- */}
                            {/* Email Address */}
                            <div className="d-flex mb-2 mt-3 mx-5">
                                <FormControl id="email" type="email" readonly={isSocialRegistration}
                                    placeholder="Email Address"
                                    maxLength={64}
                                    value={email} autocomplete={true} isRequired={true}
                                    onChangeCallback={(value) => {
                                        setEmail(value);

                                        if (isEmailAlreadyInUse)
                                            setIsEmailAlreadyInUse(false);
                                    }} />
                            </div>
                            {/* ------------------------- */}
                            {/* Registration Error - Email already in use */}
                            {
                                isEmailAlreadyInUse ? (
                                    <div className="d-flex mx-5">
                                        <p className="fw-bold text-danger" style={{ fontSize: "0.9em" }}>
                                            • The email, {email} is already in use.
                                        </p>
                                    </div>
                                ) : null
                            }
                            {/* ------------------------- */}
                            {/* Password (+ Confirmation) */}
                            <div className="d-flex flex-column mb-2 mx-5">
                                <div className="mb-2">
                                    <FormControlPassword id="password"
                                        placeholder="Password"
                                        value={password} autocomplete={true}
                                        onChangeCallback={(value) => {
                                            setPassword(value);

                                            if (!isCorrectPasswordFormat)
                                                setIsCorrectPasswordFormat(true);

                                            if (!doPasswordsMatch)
                                                setDoPasswordsMatch(true);
                                        }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <FormControlPassword id="password-confirmation"
                                        placeholder="Confirm Your Password"
                                        value={passwordConfirmation} autocomplete={true}
                                        onChangeCallback={(value) => {
                                            setPasswordConfirmation(value);

                                            if (!isCorrectPasswordFormat)
                                                setIsCorrectPasswordFormat(true);

                                            if (!doPasswordsMatch)
                                                setDoPasswordsMatch(true);
                                        }}
                                    />
                                </div>

                                {/* Password Criteria */}
                                <div className="d-flex flex-column rounded mb-2 px-2 py-1">
                                    <Form.Text className="fw-bold">Requirements for password: </Form.Text>
                                    <Form.Text className="fw-normal">1. 8 characters long. </Form.Text>
                                    <Form.Text className="fw-normal">2. Must contain 1 symbol, 1 number, 1 lower and 1 uppercase letter. </Form.Text>
                                </div>

                                {/* Mismatched Password Error */}
                                {
                                    (!doPasswordsMatch) ? (
                                        <p className="text-danger ms-1 my-0 py-0" style={{ fontSize: "0.8em" }}>
                                            • Both the Password and Password Confirmation fields do not match
                                        </p>
                                    ) : null
                                }

                                {/* Password Format */}
                                {
                                    (!isCorrectPasswordFormat) ? (
                                        <p className="text-danger ms-1 my-0 py-0" style={{ fontSize: "0.8em" }}>
                                            • The current password does not meet the criteria.
                                        </p>
                                    ) : null
                                }
                            </div>
                            {/* ------------------------- */}
                            <hr />
                            {/* ------------------------- */}
                            {/* Profile Picture */}
                            <div className="d-flex flex-column mb-2 mx-5">
                                <FormControlFile id="profile-picture"
                                    labelDesc="Profile Picture"
                                    accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                    htmlRef={imageRef}
                                    value={image} autocomplete={false} isRequired={false}
                                    onChangeCallback={onNewProfilePictureUploaded} />
                                {
                                    image ? (
                                        <div className="d-flex align-items-center justify-content-center w-100 my-2">
                                            <Image src={image} className="me-3"
                                                style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                            <Image src={image} className="me-3"
                                                style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                            <Image src={image}
                                                style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                        </div>
                                    ) : null
                                }
                                <div className="d-flex flex-column rounded mb-2 px-2 py-1">
                                    <Form.Text className="fw-bold">Requirements for profile picture setup: </Form.Text>
                                    <Form.Text className="fw-normal">1. Must not exceed 128kb. </Form.Text>
                                    <Form.Text className="fw-normal">2. Equal Width and Height Dimensions. </Form.Text>
                                </div>

                                {/* Image Format */}
                                {
                                    (!isCorrectImageFormat) ? (
                                        <Form.Label className="registration-text text-danger ms-1">
                                            The current profile picture does not meet the requirements.
                                        </Form.Label>
                                    ) : null
                                }
                            </div>
                            {/* ------------------------- */}
                            <hr />
                            {/* ------------------------- */}
                            {/* Company Name or Individual's Name */}
                            <div className="d-flex mb-2 mx-5">
                                <FormControl id="name" type="text" readonly={isSocialRegistration}
                                    placeholder={isOrganization ? "Organization Name" : "Your Name"}
                                    maxLength={128}
                                    value={isOrganization ? organizationName : name} autocomplete={false} isRequired={true}
                                    onChangeCallback={isOrganization ? setOrganizationName : setName} />
                            </div>
                            {/* ------------------------- */}
                            {/* Contact Number (Company Phone Number if Organization, Individual Phone Number otherwise) */}
                            <div className="d-flex flex-column justify-content-center mb-2 mx-5">
                                <div className="d-flex align-items-center mb-2">
                                    <Dropdown id="dropdown-country-code"
                                        onSelect={(eventKey) => {
                                            if (isContactNumberAlreadyInUse)
                                                setIsContactNumberAlreadyInUse(false);

                                            onSelectCountry(eventKey);
                                        }}
                                        className="me-3">
                                        <Dropdown.Toggle>
                                            {
                                                (countries.length > 0 && countryIndex < countries.length - 1) ?
                                                    countries[countryIndex].phone_code : "N/A"
                                            }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                countries.map((country, index) => (
                                                    <Dropdown.Item key={`country-code-${index}`}
                                                        eventKey={index}
                                                        active={countries[countryIndex].phone_code === country.phone_code}>
                                                        {"+" + country.phone_code + " (" + country.name + ")"}
                                                    </Dropdown.Item>
                                                ))
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <FormControl id="contact-number" type="tel"
                                        placeholder="Contact Number"
                                        maxLength={24}
                                        value={contactNumber} autocomplete={false} isRequired={true}
                                        onChangeCallback={(value) => {
                                            if (isContactNumberAlreadyInUse)
                                                setIsContactNumberAlreadyInUse(false);

                                            setContactNumber(value);
                                        }}
                                    />
                                </div>
                            </div>
                            {/* ------------------------- */}
                            {/* Registration Error - Contact Number already in use */}
                            {
                                isContactNumberAlreadyInUse ? (
                                    <div className="d-flex mx-5">
                                        <p className="fw-bold text-danger" style={{ fontSize: "0.9em" }}>
                                            • The phone number, +{countries[countryIndex].phone_code + contactNumber} is already in use.
                                        </p>
                                    </div>
                                ) : null
                            }
                            {/* ------------------------- */}
                            {/* NRIC or Company Registration Number */}
                            <div className="d-flex mb-2 mx-5">
                                <FormControl id="registree-id" type="text"
                                    placeholder={isOrganization ? "Company Registration ID" : "NRIC"}
                                    maxLength={64}
                                    value={isOrganization ? organizationRegID : nric} autocomplete={false} isRequired={true}
                                    onChangeCallback={isOrganization ? setOrganizationRegID : setNRIC} />
                            </div>
                            {
                                isFormAmbiguous ? (
                                    <div className="d-flex mt-3">
                                        <p className="text-danger" style={{ fontSize: "0.8em" }}>
                                            • User cannot register and represent his her email as both an individual and organization
                                            under a single registration.
                                        </p>
                                    </div>
                                ) : null
                            }
                            {/* ------------------------- */}
                            <hr />
                            {/* ------------------------- */}
                            {/* Form Submission */}
                            <div className="d-flex mb-3 justify-content-center mt-3 mx-5">
                                <Button type="submit" className="w-100">
                                    Register
                                </Button>
                            </div>
                            {/* ------------------------- */}
                            {
                                isFormIncomplete ? (
                                    <div className="d-flex mt-3 mx-5">
                                        <p className="text-danger" style={{ fontSize: "0.8em" }}>
                                            • There were missing required informations in your previous submissions.
                                            All forms marked with an asterisk (*) must be filled.
                                        </p>
                                    </div>
                                ) : null
                            }
                        </Form>
                    </Card.Body>
                    <Card.Footer className="d-flex flex-column align-items-start justify-content-center">
                        {/* ------------------------- */}
                        {/* Social Platform Registration Buttons (Google, Facebook) */}
                        <p className="fs-6 registration-header text-center">
                            List of Supported Social Providers to register:
                        </p>
                        <div className="d-flex w-100 justify-content-evenly">
                            <Button className="google-container me-3" onClick={onRegisterGoogle}>
                                <Image src={googleIcon}
                                    style={{
                                        minWidth: "16px", minHeight: "16px", maxWidth: "32px", maxHeight: "32px",
                                        width: "100%", height: "auto"
                                    }}
                                />
                                <span> </span>
                                <span className="text-dark">Google</span>
                            </Button>
                            <Button className="facebook-container me-3" onClick={onRegisterFacebook}>
                                <i className="bi bi-facebook"></i>
                                <span> </span>
                                <span className="text-light">Facebook</span>
                            </Button>
                        </div>
                        {/* ------------------------- */}
                        {/* Registration Error Message Log -> Social Platforms */}
                        {
                            errorSocialsMessage ? (
                                <div className="d-flex mt-3">
                                    <p className="text-danger" style={{ fontSize: "0.8em" }}>
                                        • {errorSocialsMessage}
                                    </p>
                                </div>
                            ) : null
                        }
                        {/* ------------------------- */}
                    </Card.Footer>
                </Card>
            </Col>
            <Modal show={smsVerifyModalShow} centered
                onHide={onCloseSMSVerifyModal}
                backdrop="static">
                <Modal.Header>
                    <Modal.Title>SMS Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fs-5">
                        Please enter the code that was sent to your phone number.
                    </p>
                    <FormControl id="sms-verify" type="number"
                        placeholder="Verfication Code Here (E.g. 112233)"
                        maxLength={6}
                        value={smsVerifyCode}
                        isRequired={false}
                        readonly={false}
                        onChangeCallback={(value) => setSMSVerifyCode(value)} />
                    <p className="mt-3" style={{ fontSize: "0.9em" }}>
                        Note: There is a chance no <b>SMS</b> would be sent to your phone if your phone is not verified by <b>Telesign</b> as
                        it&apos;s presently using <b>free trial mode</b>. You may still utilize our functionalities without this,
                        for <b>development/staging</b> servers.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onSendVerificationSMSPressed}>
                        Complete Registration
                    </Button>
                    <Button variant="primary" className="rounded-pill" onClick={onCloseSMSVerifyModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================
function FormControl({ id, labelDesc, type, placeholder, value, maxLength, autocomplete, readonly, isRequired, onChangeCallback }) {
    return (
        <>
            {
                labelDesc && labelDesc.trim().length > 0 ? (
                    <Form.Label htmlFor={id} className="me-3" style={{ width: "15%" }}>
                        {labelDesc + (isRequired ? "*" : "")}:
                    </Form.Label>
                ) : (
                    <Form.Label htmlFor={id} />
                )
            }
            <Form.Control id={id}
                required={isRequired}
                disabled={readonly}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder + (isRequired ? "*" : "")}
                autoComplete={autocomplete ? "true" : "false"}
                value={value}
                onChange={(event) => onChangeCallback ? onChangeCallback(event.target.value) : null}
            />
        </>
    );
}

function FormControlPassword({ id, labelDesc, placeholder, value, autocomplete, onChangeCallback }) {
    const passwordFieldRef = useRef();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const onVisibilityChanged = () => {
        const newState = !isPasswordVisible;
        setIsPasswordVisible(newState);
    };

    return (
        <div className="d-flex">
            {
                labelDesc && labelDesc.trim().length > 0 ? (
                    <Form.Label htmlFor={id} className="me-3" style={{ width: "15%" }}>
                        {labelDesc}*:
                    </Form.Label>
                ) : (
                    <Form.Label htmlFor={id} />
                )
            }
            <Form.Control id={id} required
                ref={passwordFieldRef}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={placeholder + "*"}
                autoComplete={autocomplete ? "true" : "false"}
                maxLength={64}
                value={value}
                onChange={(event) => onChangeCallback ? onChangeCallback(event.target.value) : null}
            />
            {
                id.toLowerCase().includes("password") ? (
                    <Button variant="link" className="registration-header" onClick={onVisibilityChanged}>
                        <i className={`bi bi-eye-${isPasswordVisible ? "fill" : "slash-fill"}`}></i>
                    </Button>
                ) : null
            }
        </div>
    );
}

function FormControlFile({ id, labelDesc, accept, onChangeCallback, htmlRef = null }) {
    return (
        <div>
            {
                labelDesc && labelDesc.trim().length > 0 ? (
                    <Form.Label htmlFor={id} className="me-3">
                        {labelDesc}:
                    </Form.Label>
                ) : (
                    <Form.Label htmlFor={id} />
                )
            }
            <Form.Control id={id}
                ref={htmlRef}
                type="file"
                accept={accept}
                onChange={(event) => onChangeCallback ? onChangeCallback(event) : null}
            />
        </div>
    );
}
// =========================================