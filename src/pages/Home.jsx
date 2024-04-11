// =========================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';

import HomePageReelModal from '../components/HomePageReelModal.jsx';
import NavigationPanelHome from '../components/NavigationPanelHome.jsx';
import CustomCarousel from '../components/CustomCarousel';

import homePageVideo from '../assets/videos/homepage-reel.mp4';
import watchReelImage from '../assets/images/watch-reel.webp';
import viewMoreImage from '../assets/images/view-more.webp';
import awardsImage from '../assets/images/home-awards.webp';
import newsImage from '../assets/images/new-concert.webp';
import horizontalBarImage from '../assets/images/horizontal-bar.webp';

import { concertItems } from '../data/concerts.js';

import underConstructionImage from '../assets/images/under-construction.webp';

import './Home.css';
// =========================================
export default function Home() {
    // ================
    const [isHomePageReelVisible, setIsHomePageReelVisible] = useState(false);

    const onShowHomePageReel = () => setIsHomePageReelVisible(true);
    const onHideHomePageReel = () => setIsHomePageReelVisible(false);
    // ================
    return (
        <div className="position-relative">
            <NavigationPanelHome />
            <Container fluid className="d-flex flex-column m-0 p-0" style={{ flex: 1, overflowX: "hidden" }}>
                {/* --------------------------------- */}
                {/* Promotional Video Reel */}
                <Row style={{ position: "relative" }}>
                    <PromoSection onShowHomePageReel={onShowHomePageReel} />
                </Row>
                {/* --------------------------------- */}
                {/* Brand/Vision */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <CompanyBrandSection />
                </Row>
                {/* --------------------------------- */}
                {/* Latest Gig */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <NewsSection />
                </Row>
                {/* --------------------------------- */}
                {/* Past Events */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <PastEventsCarouselSection />
                </Row>
                {/* --------------------------------- */}
                {/* Contact Banner */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <ContactSection />
                </Row>
                {/* --------------------------------- */}
                {/* News/Postings */}
                {/* --------------------------------- */}
            </Container>
            <HomePageReelModal isVisible={isHomePageReelVisible} onHide={onHideHomePageReel} />
        </div>
    );
}
// =========================================
function PromoSection({ onShowHomePageReel }) {
    return (
        <Col className="col-12">
            <div className="home-video-container">
                {/* Watch Reel Description Text + Image */}
                <div className="d-flex align-items-center content-absolute-button-container">
                    <p onClick={onShowHomePageReel} className="content-absolute-button-text m-0 p-0" role="button">
                        WATCH REEL
                    </p>
                    <Image src={watchReelImage} onClick={onShowHomePageReel}
                        className="content-absolute-button-image"
                        role="button" />
                </div>
                {/* Video Source */}
                <video src={homePageVideo} autoPlay muted
                    width="100%" height="auto"
                    className="d-block"
                />
            </div>
        </Col>
    );
}
// =========================================
function CompanyBrandSection() {
    return (
        <Col className="col-12">
            <Row>
                <Col className="col-md-5 col-10 d-flex flex-column align-items-center justify-content-center mx-auto">
                    <p className="home-brand-title">
                        Bridging the connection between
                        <span> </span>
                        <span className="home-brand-outline">rock enthusiasts</span>
                        <span> and </span>
                        <span className="home-brand-outline">bands</span>!
                    </p>
                </Col>
                <Col className="col-md-5 col-10 d-flex flex-column align-items-center justify-content-center mx-auto">
                    <p className="home-brand-description">
                        Republic of Rock, Global Concert Host-Max&apos;s Awards 2021 winner, with a passion for
                        precision and a dedication to delivering unforgettable experiences, stands as the beacon
                        of excellence in the realm of rock event concert hosting.
                    </p>
                    <p className="home-brand-description">
                        Seamlessly blending creativity
                        with meticulous planning, our award-winning team ensures that every chord strikes a chord,
                        every beat resonates, and every moment rocks the crowd to its core. Trust Republic of Rock
                        to elevate your event to legendary status, leaving audiences clamoring for encore after encore.
                    </p>
                    <Image src={awardsImage}
                        style={{
                            minWidth: "120px", minHeight: "120px",
                            width: "100%", height: "auto"
                        }}
                    />
                </Col>
            </Row>
        </Col>
    );
}
// =========================================
function NewsSection() {
    const navigate = useNavigate();

    return (
        <Col className="col-12">
            <div className="home-news-container">
                {/* Title */}
                <div className="d-flex flex-column justify-content-center content-absolute-title-container">
                    <p onClick={() => navigate("#")} className="content-absolute-container-title-text m-0 p-0"
                        style={{ width: "85%", userSelect: "none" }}>
                        NEW AVENUE ST. CONCERT UPDATE
                    </p>
                    <p onClick={() => navigate("#")} className="content-absolute-container-description-text m-0 p-0"
                        style={{ width: "85%", userSelect: "none" }}>
                        REFURBISHED & NEW OPENING - APRIL 2024
                    </p>
                </div>
                {/* View More Description Text + Image */}
                <div className="d-flex align-items-center content-absolute-button-container">
                    <p onClick={() => navigate("#")} className="content-absolute-button-text m-0 p-0" role="button">
                        VIEW MORE
                    </p>
                    <Image src={viewMoreImage} onClick={() => navigate("#")}
                        className="content-absolute-button-image"
                        role="button" />
                </div>
                {/* Image Source */}
                <Image src={newsImage}
                    style={{
                        minWidth: "100px", minHeight: "67px",
                        width: "100%", height: "auto"
                    }}
                />
            </div>
        </Col>
    );
}
// =========================================
function PastEventsCarouselSection() {
    // ================
    const [isSmallWidth, setIsSmallWidth] = useState(false);
    // ================
    const determineCarouselHeaderStyle = () => {
        const screenWidth = window.innerWidth;

        // Debug
        //console.log("Width: " + screenWidth);

        // Bootstrap's "sm" = 540px, "md" = 768px and so forth.
        setIsSmallWidth(screenWidth < 768);
    };
    // ================
    useEffect(() => {
        // Call the function initially and on window resize
        determineCarouselHeaderStyle();
        window.addEventListener("resize", determineCarouselHeaderStyle);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", determineCarouselHeaderStyle);
        };
    }, []);
    // ================
    return (
        <Col className="col-12">
            <Row>
                <Col className="col-md-1 col-11 ms-md-0 ms-auto">
                    {
                        isSmallWidth ? (
                            <>
                                <div className="d-flex align-items-center">
                                    <Image src={horizontalBarImage} className="me-3" />
                                    <p className="content-rotateable-text my-0 py-0">
                                        Past Concerts
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex align-items-center"
                                    style={{
                                        width: "100%", transform: "rotate(270deg)",
                                        transformOrigin: "100%", marginTop: "155px"
                                    }}>
                                    <p className="content-rotateable-text my-0 me-3 py-0">
                                        Past Concerts
                                    </p>
                                    <Image src={horizontalBarImage} />
                                </div>
                            </>
                        )
                    }
                </Col>
                <Col className="col-md-11 col-11 ms-md-0 ms-auto">
                    <CustomCarousel items={concertItems} maxCarouselItemPerRow={1} />
                </Col>
            </Row>
        </Col>
    );
}
// =========================================
function ContactSection() {
    // ================
    return (
        <Col className="col-12 d-flex flex-column align-items-center justify-content-center">
            <h1 className="m-0 p-0 text-center">Feature Currently Unavailable</h1>
            <Image src={underConstructionImage}
                style={{
                    minWidth: "128px", minHeight: "128px",
                    maxWidth: "256px", maxHeight: "256px",
                    width: "100%", height: "auto"
                }}
            />
        </Col>
    );
}
// =========================================