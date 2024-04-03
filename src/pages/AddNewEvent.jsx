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

import VenuePreviewModal from '../components/VenuePreviewModal.jsx';

import { callServerAPI } from '../apis/authApi.jsx';
import { createANewEvent } from '../feature/events/eventsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function AddNewEvent() {
    // ================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ============
    const now = new Date();

    const [name, setName] = useState("");

    const [startTime, setStartTime] = useState(now);
    const [endTime, setEndTime] = useState(now);

    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [timeWarning, setTimeWarning] = useState("");

    const [promotionalImage, setPromotionalImage] = useState(null);
    const [isCorrectImageFormat, setIsCorrectImageFormat] = useState(true);

    const updatePromotionalImage = (event) => {
        const file = event.target.files[0];

        if (!file) {
            setPromotionalImage(null);
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

                const isValid = file.size <= 512000;
                setIsCorrectImageFormat(isValid);

                if (isValid)
                    setPromotionalImage(url);
            }
            testImg.src = url;
        });
    };

    const [venues, setVenues] = useState([]);
    const [venueIndex, setVenueIndex] = useState(0);

    const onSelectVenue = (eventKey) => setVenueIndex(eventKey);

    const [targetVenuePreview, setTargetVenuePreview] = useState(null);

    const [showVenueModal, setShowVenueModal] = useState(false);
    const onShowVenuePreviewModal = (venue) => {
        setTargetVenuePreview({
            address: venue.address,
            state: venue.state,
            image_catalogues: venue.catalogues
        });

        setShowVenueModal(true);
    };
    const onCloseVenuePreviewModal = () => setShowVenueModal(false);

    const [remarks, setRemarks] = useState("");
    // ============
    useEffect(() => {
        onLoadingStart("Global");

        // Debug
        //console.log("Fetch Server's Venue List Event");
        callServerAPI("venues", "GET", null,
            // On Successful Callback
            (result) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Server Venue List Successful] Result.", result);

                setVenues(result.venues);
            },
            // On Failed Callback
            (error) => {
                onLoadingEnd("Global");

                // Debug
                //console.log("[Server Venue List Failed] Error.", error)
            }
        );
    }, []);
    // ============
    const onCreateNewEvent = (event) => {
        event.preventDefault();

        if (showTimeWarning || !isCorrectImageFormat)
            return;
        onLoadingStart("Global");

        dispatch(createANewEvent({
            event: {
                venue_id: venues[venueIndex].id,
                name: name,
                start_time: startTime,
                end_time: endTime,
                promotional_image: promotionalImage,
                remarks: remarks
            }
        })).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Create a New Event Failed] Payload.", action.payload)
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[Create a New Event Successful] Payload.", action.payload);

                    navigate("/dashboard");
                }
            }
        );
    };
    // ================
    return (
        <>
            <Container fluid>
                <Form onSubmit={onCreateNewEvent}>
                    <Row>
                        <Col className="col-12 d-flex flex-column align-items-center justify-content-center col-12 mt-3 mb-3"
                            style={{ width: "100%" }}>
                            <h2 className="fw-bold text-center">
                                Create a New Event
                            </h2>
                        </Col>
                        <Col className="col-12 d-flex flex-column align-items-start justify-content-center col-12 mb-3"
                            style={{ width: "100%" }}>
                            {/* -------------------------------------- */}
                            {/* Event Name */}
                            <div className="d-flex mb-2 mt-3 w-100">
                                <Form.Label htmlFor="event-name" className="me-3" style={{ width: "15%" }}>
                                    Event Name:
                                </Form.Label>
                                <Form.Control id="event-name"
                                    value={name}
                                    as="textarea"
                                    rows="1"
                                    maxLength={64}
                                    type="text"
                                    onChange={(event) => setName(event.target.value)}
                                    style={{ resize: "none", height: "fit-content", width: "50%" }}
                                />
                            </div>
                            {/* -------------------------------------- */}
                            {/* Start + End Time (And Warning Message) */}
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="event-start-time" className="me-3" style={{ width: "15%" }}>
                                    Start Time/Date:
                                </Form.Label>
                                <Form.Control id="event-start-time"
                                    value={startTime ? startTime.toISOString().slice(0, 16) : ''}
                                    type="datetime-local"
                                    onChange={(event) => {
                                        const localTime = new Date(event.target.value);

                                        // Offset in milliseconds
                                        const localOffset = localTime.getTimezoneOffset() * 60000;
                                        const localDateTime = new Date(localTime.getTime() - localOffset);

                                        if (endTime <= localDateTime) {
                                            setShowTimeWarning(true);
                                            setTimeWarning("The event's end date/time cannot be before the start date/time.");
                                        }
                                        else
                                            setShowTimeWarning(false);

                                        setStartTime(localDateTime);
                                    }}
                                    style={{ width: "50%" }}
                                />
                            </div>
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="event-end-time" className="me-3" style={{ width: "15%" }}>
                                    End Time/Date:
                                </Form.Label>
                                <Form.Control id="event-end-time"
                                    value={endTime ? endTime.toISOString().slice(0, 16) : ''}
                                    type="datetime-local"
                                    onChange={(event) => {
                                        const localTime = new Date(event.target.value);

                                        // Offset in milliseconds
                                        const localOffset = localTime.getTimezoneOffset() * 60000;
                                        const localDateTime = new Date(localTime.getTime() - localOffset);

                                        if (localDateTime <= startTime) {
                                            setShowTimeWarning(true);
                                            setTimeWarning("The event's end date/time cannot be before the start date/time.");
                                        }
                                        else
                                            setShowTimeWarning(false);

                                        setEndTime(localDateTime);
                                    }}
                                    style={{ width: "50%" }}
                                />
                            </div>
                            {
                                showTimeWarning ? (
                                    <div className="mb-3">
                                        <p className="text-danger my-0 py-0">
                                            {timeWarning}
                                        </p>
                                    </div>
                                ) : null
                            }
                            {/* -------------------------------------- */}
                            {/* Promotional Image */}
                            <div className="d-flex mb-2 w-100">
                                <Form.Label htmlFor="promotional-banner-image" className="me-3" style={{ width: "15%" }}>
                                    Promotional Banner Image:<span> </span>
                                </Form.Label>
                                <Form.Control id="promotional-banner-image"
                                    className={`${isCorrectImageFormat ? "text-secondary" : "text-danger fw-bold"} mb-2`}
                                    type="file" accept="image/png, image/jpg, image/jpeg, image/webp, image/svg"
                                    style={{ width: "50%" }}
                                    onChange={updatePromotionalImage} />
                            </div>

                            {/* Image Preview */}
                            {
                                promotionalImage ? (
                                    <Col className="col-12 d-flex align-items-center mb-3">
                                        <Image src={promotionalImage} className="me-3"
                                            style={{ minWidth: "96px", minHeight: "96px", maxWidth: "128px", maxHeight: "128px", width: "100%", height: "auto" }} />
                                        <Image src={promotionalImage} className="me-3"
                                            style={{ minWidth: "64px", minHeight: "64px", maxWidth: "96px", maxHeight: "96px", width: "100%", height: "auto" }} />
                                        <Image src={promotionalImage}
                                            style={{ minWidth: "32px", minHeight: "32x", maxWidth: "64px", maxHeight: "64px", width: "100%", height: "auto" }} />
                                    </Col>
                                ) : null
                            }

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
                            <Col className="col-12 d-flex flex-column rounded mb-4 px-2">
                                <Form.Text className="text-non-links-primary login-text fw-bold">Requirements for promotional banner image setup: </Form.Text>
                                <Form.Text className="text-non-links-primary login-text">1. Must not exceed 512kb. </Form.Text>
                            </Col>
                            {/* -------------------------------------- */}
                            {/* Venue */}
                            {
                                venues.length > 0 ? (
                                    <div className="d-flex mb-2 w-100">
                                        <p className="my-0 py-0 me-3" style={{ width: "15%" }}>
                                            Venue:
                                        </p>
                                        <Dropdown id="dropdown-venue" onSelect={onSelectVenue} className="me-3">
                                            <Dropdown.Toggle>
                                                {venues[venueIndex].address + ", " + venues[venueIndex].state}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {
                                                    venues.map((venue, index) => (
                                                        <Dropdown.Item key={`venue-${index}`}
                                                            eventKey={index}
                                                            active={venueIndex === index}>
                                                            {venue.address + ", " + venue.state}
                                                        </Dropdown.Item>
                                                    ))
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Button onClick={() => onShowVenuePreviewModal(venues[venueIndex])}>
                                            <i className="bi bi-eye"></i>
                                        </Button>
                                    </div>
                                ) : null
                            }
                            {/* -------------------------------------- */}
                            {/* Remarks */}
                            <div className="d-flex mb-2 mt-3 w-100">
                                <Form.Label htmlFor="remarks" className="me-3" style={{ width: "15%" }}>
                                    Remark(s):
                                </Form.Label>
                                <Form.Control id="remarks"
                                    value={remarks}
                                    as="textarea"
                                    rows="5"
                                    maxLength={256}
                                    type="text"
                                    onChange={(event) => setRemarks(event.target.value)}
                                    style={{ resize: "none", height: "fit-content", width: "50%" }}
                                />
                            </div>
                            {/* -------------------------------------- */}
                            {/* Submission */}
                            <Button type="submit">
                                Submit
                            </Button>
                            {/* -------------------------------------- */}
                        </Col>
                    </Row>
                </Form>
            </Container>
            <VenuePreviewModal show={showVenueModal} venue={targetVenuePreview} onCloseModalCallback={onCloseVenuePreviewModal} />
        </>
    );
}
// =========================================