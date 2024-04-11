// =========================================
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Image from 'react-bootstrap/Image';

import deadRobot from '../../assets/images/misc/dead-robot.webp';
// =========================================
export default function NetErrorPage() {
    return (
        <Container fluid style={{ flex: 1, minHeight: "60vh" }}>
            <Row className="mt-5">
                <Col className="col-12 d-flex flex-column align-items-center justify-content-center">
                    <h1 className="text-center">
                        Server Error Encountered.
                    </h1>
                    <h5 className="text-center mt-3">
                        Unfortunately, we are unable to connect you to the server at the moment. Pleaase try again later.
                    </h5>
                    <Image src={deadRobot}
                        style={{
                            minWidth: "160px", minHeight: "160px",
                            maxWidth: "480px", maxHeight: "480px",
                            width: "320px", height: "320px"
                        }} />
                </Col>
            </Row>
        </Container>
    );
}
// =========================================