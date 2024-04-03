// =========================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import VenuePreviewModal from '../components/VenuePreviewModal.jsx';
import DeleteEventModal from '../components/DeleteEventModal.jsx';

import { updateActiveUser } from '../feature/activeUser/activeUserSlice.jsx';
import { fetchEventsUser } from '../feature/events/eventsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
import { formatDate, formatTime } from '../data/time.js';

import defaultVenueImage from "../assets/images/venue-default.webp";
// =========================================
export default function Dashboard() {
    // ================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // ================
    const [targetVenuePreview, setTargetVenuePreview] = useState(null);

    const [showVenueModal, setShowVenueModal] = useState(false);
    const onShowVenuePreviewModal = (event) => {
        setTargetVenuePreview({
            address: event.venue_address,
            state: event.venue_state,
            image_catalogues: event.venue_image_catalogues
        });

        setShowVenueModal(true);
    };
    const onCloseVenuePreviewModal = () => setShowVenueModal(false);

    const onAddNewEvent = () => navigate("/event/add");
    const onModifyEvent = (event) => navigate("/event/modify", { state: { event: event } });

    const [targetEvent, setTargetEvent] = useState(null);
    const [showDeleteEvent, setShowDeleteEvent] = useState(false);
    const onCloseDeleteEventModalCallback = () => setShowDeleteEvent(false);
    const onShowDeleteEventModalCallback = () => setShowDeleteEvent(true);

    const onDeleteEvent = (currentEvent) => {
        setTargetEvent(currentEvent);
        onShowDeleteEventModalCallback();
    };
    // ================
    const events = useSelector((state) => state.events.events);

    useEffect(() => {
        onLoadingStart("Global");

        dispatch(fetchEventsUser()).then(
            (action) => {
                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Obtaining User Events Failed] Payload.", action.payload)
                }
                // On Promise Fulfilled
                else {
                    onLoadingEnd("Global");

                    // Debug
                    //console.log("[On Obtaining User Events Successful] Payload.", action.payload);
                }
            }
        );
    }, [dispatch]);
    // ================
    useEffect(() => {
        const onUserIdentifiedCallback = (event) => dispatch(updateActiveUser(event.detail));
        window.addEventListener("User Identified", onUserIdentifiedCallback);

        return (() => {
            window.removeEventListener("User Identified", onUserIdentifiedCallback);
        });
    }, [dispatch]);
    // ================
    return (
        <>
            <Container fluid>
                <Row className="d-flex justify-content-center my-3">
                    <Col className="col-4 d-flex justify-content-center">
                        <Button onClick={onAddNewEvent}>
                            Add a new Event
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {
                        events.map((event, index) => (
                            <EventItem key={`event-${index}`}
                                event={event}
                                eventIndex={index}
                                onModifyEventCallback={onModifyEvent}
                                onDeleteEventCallback={onDeleteEvent}
                                onShowVenueModalCallback={onShowVenuePreviewModal} />
                        ))
                    }
                </Row>
            </Container>
            <VenuePreviewModal show={showVenueModal} venue={targetVenuePreview} onCloseModalCallback={onCloseVenuePreviewModal} />
            <DeleteEventModal show={showDeleteEvent} event={targetEvent}
                onCloseModalCallback={onCloseDeleteEventModalCallback} />
        </>
    );
}

function EventItem({ event, onModifyEventCallback, onDeleteEventCallback, onShowVenueModalCallback }) {
    return (
        <Col className="col-12 mb-3">
            <Row className="d-flex align-items-center justify-content-evenly mx-3 py-2" style={{ borderRadius: "10px", border: "1px solid black" }}>
                {/* Event Promo Image. Left-most of the event banner. */}
                <Col className="col-3 d-flex justify-content-center">
                    <Image src={event.event_promotional_image ? event.event_promotional_image : defaultVenueImage}
                        className="me-3"
                        style={{
                            minWidth: "64px", minHeight: "64px",
                            maxWidth: "128px", maxHeight: "128x",
                            width: "100%", height: "auto"
                        }} />
                </Col>
                {/* Information Section. Located on the right side of the event banner. */}
                <Col className="col-9 d-flex flex-column align-items-start">
                    {/* Top-most row of the Information Section. Contains the Event Name, Approved State & Modify/Delete Functionalities */}
                    <Row className="mb-4 w-100">
                        <Col className="col-12 d-flex align-items-center justify-content-between">
                            <p className="fs-2 fw-bold my-0 py-0">
                                {event.event_name}
                                <span> </span>
                                <span>
                                    <i title={`${event.staff_email ? "Approved" : "Pending"}`}
                                        className="fs-4 bi bi-circle-fill me-2"
                                        style={{ color: event.staff_email ? "lightgreen" : "red" }}></i>
                                </span>
                            </p>

                            <div className="d-flex align-items-center ms-auto">
                                <Button onClick={() => onModifyEventCallback(event)} className="me-2">
                                    <i className="bi bi-screwdriver"></i>
                                </Button>
                                <Button onClick={() => onDeleteEventCallback(event)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {/* 2nd row - Start/End Dates */}
                    <Row className="w-100">
                        <Col className="col-6">
                            <p className="my-0 py-0">
                                <span className="fw-bold">Start Date/Time</span>:
                                <span> </span>
                                {formatDate(new Date(event.event_start_time), false) + ", " + formatTime(new Date(event.event_start_time), true)}
                            </p>
                        </Col>
                        <Col className="col-6">
                            <p className="my-0 py-0">
                                <span className="fw-bold">End Date/Time</span>:
                                <span> </span>
                                {formatDate(new Date(event.event_end_time), false) + ", " + formatTime(new Date(event.event_end_time), true)}
                            </p>
                        </Col>
                    </Row>
                    {/* 
                        3rd row of the Information Section. Split between 2 elements, separated horizontally.
                        The left = Organiser's Information.
                        The right = Assigned Staff's Information
                    */}
                    <Row className="w-100">
                        <Col className="col-6">
                            <p className="my-0 py-0">
                                <span className="fw-bold">Organiser</span>: {event.organiser_first_name + " " + event.organiser_last_name}
                            </p>
                            <p className="my-0 py-0">
                                <span className="fw-bold">Contact (Email)</span>: {event.organiser_email}
                            </p>
                            <p className="my-0 py-0">
                                <span className="fw-bold">Contact (Phone Number)</span>: {"+" + event.organiser_phone_code + event.organiser_contact_number}
                            </p>
                        </Col>
                        <Col className="col-6">
                            <p className="my-0 py-0">
                                <span className="fw-bold">Coordinating Staff</span>:
                                <span> </span>
                                <span>{(event.staff_first_name && event.staff_last_name) ?
                                    (event.staff_first_name + " " + event.staff_last_name) : "N/A"}</span>
                            </p>
                            <p className="my-0 py-0">
                                <span className="fw-bold">Contact (Email)</span>:
                                <span> </span>
                                <span>{event.staff_email ? (event.staff_email) : "N/A"}</span>
                            </p>
                            <p className="my-0 py-0">
                                <span className="fw-bold">Contact (Phone Number)</span>:
                                <span> </span>
                                <span>{(event.staff_phone_code && event.staff_contact_number) ?
                                    ("+" + event.staff_phone_code + event.staff_contact_number) : "N/A"}</span>
                            </p>
                        </Col>
                    </Row>
                    {/* 4th row of the Information Section. Contains the Venue's Information */}
                    <Row className="mt-3">
                        <Col className="col-12 d-flex align-items-center">
                            <p className="my-0 py-0 me-3">
                                <span className="fw-bold">Venue</span>: {event.venue_address + ", " + event.venue_state + "."}
                            </p>
                            <Button onClick={() => onShowVenueModalCallback(event)}>
                                <i className="bi bi-eye"></i>
                            </Button>
                        </Col>
                    </Row>
                    {/* 5th row of the Information Section. Remarks. */}
                    <Row className="mt-3 w-100">
                        <Col className="col-12 d-flex flex-column">
                            <p className="my-0 py-0 me-3">
                                <span className="fw-bold">Remarks</span>:
                            </p>
                            <Form.Control id="event-name"
                                value={event.event_remarks ? event.event_remarks : "N/A"}
                                as="textarea" readOnly
                                rows="5"
                                type="text"
                                style={{ resize: "none", height: "fit-content", width: "50%" }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}
// =========================================