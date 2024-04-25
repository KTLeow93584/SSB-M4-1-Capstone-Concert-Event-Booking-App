// =========================================
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';

import NavigationPanelUser from '../components/navs/NavigationPanelUser.jsx';
import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
import { getUserInfo, updateUserInfo } from '../feature/activeUser/activeUserSlice.jsx';

import defaultProfileImage from '../assets/images/user-profile-default.webp';
// =========================================
export default function ProfilePage() {
    // ================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ============
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState(null);
    const [countries, setCountries] = useState([]);
    const [contactNumber, setContactNumber] = useState("");

    const [image, setImage] = useState("");
    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);

    const updateProfileImage = (event) => {
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
                // Debug
                //console.log("[On Profile Picture Upload] Width: " + width + ", Height: " + height);

                const isValid = file.size <= 128000;
                setIsCorrectImageFormat(isValid);

                if (isValid)
                    setImage(url);
            }
            testImg.src = url;
        });
    };
    // ============
    useEffect(() => {
        onLoadingStart("Global");

        // Debug
        //console.log("Fetching User's Update Info");
        dispatch(getUserInfo()).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.payload.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Get User Info Failed] Payload.", action.payload);
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Get User Info Successful] Payload.", action.payload);

                    setName(action.payload.client_data.user.name);
                    setEmail(action.payload.client_data.user.email);
                    setCountry({
                        id: action.payload.client_data.user.country_id,
                        name: action.payload.client_data.user.country_name,
                        code: action.payload.client_data.user.country_code
                    });
                    setContactNumber(action.payload.client_data.user.contact_number);
                    setImage(action.payload.client_data.user.profile_picture);

                    setCountries(action.payload.client_data.countries);
                }
            }
        );
    }, [dispatch]);
    // ============
    const onSelectCountry = (eventKey) => {
        const countryObj = JSON.parse(eventKey);
        const newCountry = {
            id: countryObj.id,
            name: countryObj.name,
            code: countryObj.phone_code
        };

        setCountry(newCountry);
    };
    // ============
    const onUpdateUserProfile = (event) => {
        event.preventDefault();

        if (!isCorrectImageFormat)
            return;
        onLoadingStart("Global");

        dispatch(updateUserInfo({
            name: name,
            country_id: country ? country.id : null,
            contact_number: contactNumber,
            profile_picture: image
        })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.payload.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Update User Profile Failed] Payload.", action.payload)
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Update User Profile Successful] Payload.", action.payload);
                }
            }
        );
    };
    // ================
    const onReturnToDashboard = () => {
        navigate("/dashboard");
    };
    // ================
    return (
        <>
            <NavigationPanelUser />
            <Container fluid style={{ flex: 1 }}>
                <Form onSubmit={onUpdateUserProfile}>
                    <Row className="d-flex flex-column align-items-center mb-3">
                        <Col className="col-12 d-flex flex-column align-items-center col-12 mt-3 mb-3 w-50">
                            <h2 className="fw-bold text-center">
                                Profile Page
                            </h2>
                        </Col>
                        <Col className="col-12 d-flex flex-column align-items-center col-12 mb-3 ms-5 w-50">
                            {/* -------------------------------------- */}
                            {/* User Name */}
                            <div className="d-flex mb-2 mt-3 w-100">
                                <Form.Label htmlFor="name" className="me-3" style={{ width: "15%", minWidth: "60px" }}>
                                    Name:
                                </Form.Label>
                                <Form.Control id="name"
                                    value={name}
                                    maxLength={64}
                                    type="text"
                                    className="w-100"
                                    onChange={(event) => setName(event.target.value)}
                                    style={{ resize: "none", height: "fit-content" }}
                                />
                            </div>
                            {/* -------------------------------------- */}
                            {/* Email */}
                            <div className="d-flex mb-3 mt-3 w-100">
                                <Form.Label htmlFor="name" className="me-3" style={{ width: "15%", minWidth: "60px" }}>
                                    Email:
                                </Form.Label>
                                <Form.Control id="email"
                                    value={email}
                                    maxLength={64}
                                    type="email"
                                    className="w-100"
                                    style={{ resize: "none", height: "fit-content" }}
                                    disabled
                                />
                            </div>
                            {/* -------------------------------------- */}
                            {/* Country Origin */}
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="country" className="me-3" style={{ width: "15%", minWidth: "60px" }}>
                                    Country:
                                </Form.Label>
                                <Dropdown id="country" onSelect={onSelectCountry} className="w-100 me-3">
                                    <Dropdown.Toggle>
                                        {country ? country.name : "N/A"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            countries.map((currentCountry, index) => (
                                                <Dropdown.Item key={`country-code-${index}`}
                                                    eventKey={JSON.stringify(countries[index])}
                                                    active={country.id === currentCountry.id}>
                                                    {currentCountry.name}
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            {/* -------------------------------------- */}
                            {/* Contact Number */}
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="contact-number" className="me-3" style={{ width: "15%", minWidth: "60px" }}>
                                    Contact Number:
                                </Form.Label>
                                <div className="d-flex w-100">
                                    <Form.Control id="country-code"
                                        value={country ? country.code : ""}
                                        maxLength={64}
                                        type="tel"
                                        className="me-1"
                                        style={{
                                            resize: "none", height: "fit-content", width: "5%",
                                            minWidth: "45px", maxWidth: "45px"
                                        }}
                                        disabled />
                                    <Form.Control id="contact-number"
                                        value={contactNumber}
                                        maxLength={64}
                                        type="tel"
                                        onChange={(event) => setContactNumber(event.target.value)}
                                        style={{ resize: "none", height: "fit-content" }}
                                        required />
                                </div>
                            </div>
                            {/* -------------------------------------- */}
                            {/* Profile Picture (Image) */}
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="profile-picture" className="me-3" style={{ width: "15%", minWidth: "60px" }}>
                                    Profile Picture:<span> </span>
                                </Form.Label>
                                <Form.Control id="profile-picture"
                                    className={`${isCorrectImageFormat ? "text-secondary" : "text-danger fw-bold"} mb-2 w-100`}
                                    style={{ resize: "none", height: "fit-content" }}
                                    type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                    onChange={updateProfileImage} />
                            </div>

                            {/* Image Preview */}
                            <div className="d-flex align-items-center mb-3">
                                <Image src={image ? image : defaultProfileImage} className="me-3"
                                    style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                <Image src={image ? image : defaultProfileImage} className="me-3"
                                    style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                <Image src={image ? image : defaultProfileImage}
                                    style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                            </div>

                            {/* Image Format */}
                            {
                                (!isCorrectImageFormat) ?
                                    (
                                        <Form.Label className="text-danger">
                                            The current profile picture does not meet the requirements.
                                        </Form.Label>
                                    ) :
                                    null
                            }

                            {/* Image Conditions */}
                            <div className="d-flex flex-column rounded mb-4 px-2">
                                <Form.Text className="text-non-links-primary login-text fw-bold">Requirements for promotional banner image setup: </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">1. Must not exceed 128kb. </Form.Text>
                            </div>
                            {/* -------------------------------------- */}
                            <div className="d-flex justify-content-center w-100">
                                <Button type="submit" style={{ marginRight: "10%" }}>
                                    Save Changes
                                </Button>
                                <Button onClick={onReturnToDashboard}>
                                    Return to Dashboard
                                </Button>
                            </div>
                            {/* -------------------------------------- */}
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );
}
// =========================================