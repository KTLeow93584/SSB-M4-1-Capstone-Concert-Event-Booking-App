// =========================================
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Image from 'react-bootstrap/Image';

import underConstructionImage from '../assets/images/under-construction.webp';
// =========================================
export default function Home() {
    // ================
    return (
        <>
            <Container fluid className="d-flex flex-column" style={{ flex: 1 }}>
                <Row className="d-flex align-items-center justify-content-center" style={{ flex: 1 }}>
                    <h1 className="m-0 p-0 text-center">Page Currently Unavailable</h1>
                    <Image src={underConstructionImage}
                        style={{
                            minWidth: "128px", minHeight: "128px",
                            maxWidth: "256px", maxHeight: "256px",
                            width: "100%", height: "auto"
                        }}
                    />
                </Row>
            </Container>
        </>
    );
}
// =========================================