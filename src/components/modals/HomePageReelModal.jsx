// =========================================
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import './HomePageReelModal.css';
// =========================================
export default function HomePageReelModal({ isVisible, onHide }) {
    // ================
    const modalRef = useRef(null);
    // ================
    const [iframeWidth, setIframeWidth] = useState("0px");
    const [iframeHeight, setIframeHeight] = useState("0px");
    // ================
    const calculateIframeDimensions = () => {
        const modalElement = modalRef.current;
        if (modalElement) {
            const frameWidth = modalElement.offsetWidth;

            const aspectRatio = 1.6;
            setIframeWidth(frameWidth);
            setIframeHeight(Math.round(frameWidth / aspectRatio));
        }
    };

    const onShowModal = () => calculateIframeDimensions();
    // ================
    useEffect(() => {
        // Call the function initially and on window resize
        calculateIframeDimensions();
        window.addEventListener("resize", calculateIframeDimensions);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", calculateIframeDimensions);
        };
    }, []);
    // ================
    return (
        <Modal size="lg" centered show={isVisible} onShow={onShowModal} onHide={onHide}>
            <div ref={modalRef}>
                <iframe width={iframeWidth} height={iframeHeight}
                    src="https://www.youtube.com/embed/3uczy_O7-uQ?si=hvmp-yDNP-zqVEog&autoplay=1"
                    title="Home Page Reel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen>
                </iframe>
            </div>
        </Modal>
    );
}
// =========================================