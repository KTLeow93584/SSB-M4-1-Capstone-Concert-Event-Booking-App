// =========================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParallax, useParallaxController } from 'react-scroll-parallax';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

import HomePageReelModal from '../../components/modals/HomePageReelModal.jsx';
import { NavigationPanelHome } from '../../components/navs';
import CustomCarousel from '../../components/carousels';

import { concertItems } from '../../data/concerts.js';
import { posts } from '../../data/posts.js';

import SVGButtonArrow from '../../components/svg-components/SVGButtonArrow.jsx';
import SVGButtonPlay from '../../components/svg-components/SVGButtonPlay.jsx';
import SVGIconArrow from '../../components/svg-components/SVGIconArrow.jsx';

import homePageVideo from '../../assets/videos/landing/homepage-reel.mp4';
import awardsImage from '../../assets/images/landing/home-awards.webp';
import newsImage from '../../assets/images/landing/new-concert.webp';
import horizontalBarImage from '../../assets/images/landing/horizontal-bar.webp';
import contactBannerrImage from '../../assets/images/landing/contact-banner.webp';

import './Home.css';
// =========================================
export default function Home() {
    // ================
    const [isHomePageReelVisible, setIsHomePageReelVisible] = useState(false);

    const onShowHomePageReel = () => setIsHomePageReelVisible(true);
    const onHideHomePageReel = () => setIsHomePageReelVisible(false);
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
                    <GigSection />
                </Row>
                {/* --------------------------------- */}
                {/* Past Events */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <PastEventsCarouselSection isSmallWidth={isSmallWidth} />
                </Row>
                {/* --------------------------------- */}
                {/* Contact Banner */}
                <Row className="mt-5" style={{ position: "relative" }}>
                    <ContactSection />
                </Row>
                {/* --------------------------------- */}
                {/* Postings */}
                <Row className="my-5" style={{ position: "relative" }}>
                    <PostsSection isSmallWidth={isSmallWidth} />
                </Row>
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
                    <SVGButtonPlay width="95" height="95"
                        onClick={onShowHomePageReel}
                        className="content-explore-button" />
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
function GigSection() {
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
                    <SVGButtonArrow width="65" height="65"
                        onClick={() => navigate("#")}
                        className="content-explore-button" />
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
function PastEventsCarouselSection({ isSmallWidth }) {
    // ================
    const title = "Past Concerts";
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
                                        {title}
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
                                        {title}
                                    </p>
                                    <Image src={horizontalBarImage} />
                                </div>
                            </>
                        )
                    }
                </Col>
                <Col className="col-11 ms-md-0 ms-auto">
                    <CustomCarousel items={concertItems} maxCarouselItemPerRow={1} />
                </Col>
            </Row>
        </Col>
    );
}
// =========================================
function ContactSection() {
    // ================
    const { ref } = useParallax({ speed: 25 });
    const parallaxController = useParallaxController();
    // ================
    return (
        <Col className="col-12">
            <div className="contact-parallax-bg-container">
                <Image src={contactBannerrImage}
                    className="contact-parallax-bg-image"
                    ref={ref} onLoad={() => parallaxController.update()}
                />
                <Button className="contact-button">
                    <span className="contact-button-text">
                        Contact Us!
                    </span>
                </Button>
            </div>
        </Col>
    );
}
// =========================================
function PostsSection({ isSmallWidth }) {
    // ================
    const title = "Latest News";
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
                                        {title}
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
                                        {title}
                                    </p>
                                    <Image src={horizontalBarImage} />
                                </div>
                            </>
                        )
                    }
                </Col>
                <Col className="col-md-9 col-11 ms-auto me-auto">
                    <Row>
                        {
                            posts.map((post, index) => (
                                <Post key={`post-${index}`} category={post.category} title={post.title} />
                            ))
                        }
                    </Row>
                </Col>
            </Row>
        </Col>
    );
}

function Post({ category, title }) {
    const navigate = useNavigate();

    return (
        <Col className="col-lg-4 col-12">
            <Card className="post-card" role="button" onClick={() => navigate("#")}>
                <Card.Body className="post-body">
                    <p className="post-category-text">THE LATEST // {category.toUpperCase()}</p>
                    <p className="post-title-text">{title}</p>
                    <div className="post-button">
                        <SVGIconArrow width="60" height="45" />
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
}
// =========================================