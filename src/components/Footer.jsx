
// =========================================
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';

import logoImage from "../assets/images/logo.webp";
import "./Footer.css";
// =========================================
export default function Footer() {
    return (
        <Container fluid className="footer-container">
            {/* More Info/Contact Us */}
            <Row className="d-flex justify-content-center my-3">

                {/* About Us */}
                <Col className="col-xl-2 col-lg-5 col-sm-6 col-12 d-flex flex-column align-items-center align-items-sm-start mb-3">
                    <FooterHeader header="About Us" />
                    <FooterLink text="About Republic of Rock" link="/" />
                    <FooterLink text="Testimonials" link="/" />
                    <FooterLink text="Career" link="/" />
                </Col>

                {/* Resources */}
                <Col className="col-xl-2 col-lg-5 col-sm-6 col-12 d-flex flex-column align-items-center align-items-sm-start mb-3">
                    <FooterHeader header="Resources" />
                    <FooterLink text="Certified Partners" link="/" />
                    <FooterLink text="FAQs" link="/" />
                    <FooterLink text="Blog" link="/" />
                    <FooterLink text="Videos" link="/" />
                    <FooterLink text="Case Studies" link="/" />
                </Col>

                {/* Office Location */}
                <Col className="col-xl-2 col-lg-5 col-sm-6 col-12 d-flex flex-column align-items-center align-items-sm-start mb-3">
                    <FooterHeader header="Office" />
                    <FooterLink text="123, Florentes Street, 456789 Postal, Codaco." link="/" />
                </Col>

                {/* How to Contact Us */}
                <Col className="col-xl-3 col-lg-5 col-sm-6 col-12 d-flex flex-column align-items-center align-items-sm-start mb-3">
                    <FooterHeader header="Contact Us" />
                    {/* Email */}
                    <div className="d-flex">
                        <p className="fs-6 fw-bold footer-text me-1 my-0 py-0">Email: </p>
                        <a href={"mailto:contactus@example-ror.com"} className="fs-6 footer-header">
                            contactus@example-ror.com
                        </a>
                    </div>
                    {/* Contact Number */}
                    <div className="d-flex">
                        <p className="fs-6 fw-bold footer-text me-1 my-0 py-0">Phone Number: </p>
                        <a href={"tel:+60111111111"} className="fs-6 footer-header">
                            (+60)11-1111111
                        </a>
                    </div>
                </Col>

            </Row>
            {/* Socials */}
            <Row className="d-flex align-items-center justify-content-center my-3">
                {/* Logo */}
                <Col className="col-xl-3 col-sm-5 col-10 d-flex justify-content-center justify-content-md-start mb-3">
                    <Image src={logoImage} className="footer-logo"
                        style={{
                            width: "100%", height: "auto"
                        }}
                    />
                </Col>
                {/* Social Platforms */}
                <Col className="col-xl-6 col-sm-5 col-10 d-flex justify-content-center mb-3">
                    <a href="#" rel="noreferrer" className="me-3">
                        <i className="fs-5 bi bi-facebook footer-text"></i>
                    </a>
                    <a href="#" rel="noreferrer" className="me-3">
                        <i className="fs-5 bi bi-instagram footer-text"></i>
                    </a>
                    <a href="#" rel="noreferrer" className="me-3">
                        <i className="fs-5 bi bi-linkedin footer-text"></i>
                    </a>
                    <a href="#" rel="noreferrer" className="me-3">
                        <i className="fs-5 bi bi-twitter footer-text"></i>
                    </a>
                    <a href="#" rel="noreferrer" className="me-3">
                        <i className="fs-5 bi bi-youtube footer-text"></i>
                    </a>
                </Col>
            </Row>
            {/* Terms and Conditions */}
            <Row className="d-flex justify-content-center my-3">
                <Col className="col-xl-6 col-lg-5 col-10 d-flex flex-column align-items-center align-items-lg-start">
                    <p className="fs-6 footer-text m-0 p-0 text-center">
                        This is a mock website as part of <b>Sigma School&apos;s Capstone Project</b>.
                    </p>
                    <p className="fs-6 footer-text m-0 p-0 text-center">
                        Created by <b>Leow Kean Tat</b> (Alias: <b>Kaz/Project Kazcade</b>).
                    </p>
                </Col>
                <Col className="col-xl-4 col-lg-5 col-10 d-flex flex-column align-items-center align-items-lg-start">
                    <div className="d-flex">
                        <Link to={"#"} className="text-center">
                            Terms and Conditions
                        </Link>
                        <span className="fs-6 footer-text mx-2">&</span>
                        <Link to={"#"} className="text-center">
                            Privacy and Policy
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

function FooterHeader({ header }) {
    return (
        <p className="fs-5 fw-bold footer-header">
            {header}
        </p>
    );
}

function FooterLink({ text, link }) {
    return (
        <Link to={link} className="fs-6 footer-link" rel="noreferrer">
            {text}
        </Link>
    );
}
// =========================================