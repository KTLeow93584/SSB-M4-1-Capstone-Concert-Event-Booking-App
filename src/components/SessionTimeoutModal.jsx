// =========================================
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// =========================================
export default function SessionTimeoutModal({ show, onCloseModalCallback }) {
    return (
        <Modal show={show} onHide={onCloseModalCallback} size="lg" centered>
            <Modal.Header closeButton className="fs-4">
                Session Timed Out
            </Modal.Header>
            <Modal.Body>
                <p className="fs-6 m-0 p-0">
                    Please login again to continue.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="rounded-pill" onClick={onCloseModalCallback}>
                    Okay
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
// =========================================