// =========================================
import { useEffect, useState } from 'react';

import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
// =========================================
export default function VenuePreviewModal({ show, venue = null, onCloseModalCallback = null }) {
    const [activeVenue, setActiveVenue] = useState(venue);

    useEffect(() => {
        setActiveVenue(venue);
    }, [venue])

    return (
        <Modal show={show} onHide={onCloseModalCallback} size="lg" centered>
            <Modal.Header closeButton className="fs-4">
                {activeVenue ? (activeVenue.address + ", " + activeVenue.state) : ""}
            </Modal.Header>
            <Modal.Body>
                <Carousel>
                    {
                        activeVenue && activeVenue.image_catalogues.length > 0 ? (
                            activeVenue.image_catalogues.map((venueImage, index) => (
                                <Carousel.Item key={`venue-image-${index}`} >
                                    <Image
                                        src={venueImage}
                                        className="me-3"
                                        style={{
                                            minWidth: "128px", minHeight: "128px",
                                            maxWidth: "768px", maxHeight: "768px",
                                            width: "100%", height: "auto"
                                        }} />
                                </Carousel.Item>
                            ))) : null
                    }
                </Carousel>
            </Modal.Body>
        </Modal>
    );
}
// =========================================