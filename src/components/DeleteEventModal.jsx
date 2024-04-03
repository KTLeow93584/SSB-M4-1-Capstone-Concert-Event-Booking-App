// =========================================
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { deleteEvent } from '../feature/events/eventsSlice.jsx';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
// =========================================
export default function DeleteEventModal({ show, event, onCloseModalCallback, onAfterDeleteCallback = null }) {
    // =====================
    const [error, setError] = useState(null);

    const onCloseModal = () => {
        setError(null);
        if (onCloseModalCallback)
            onCloseModalCallback();
    };
    // =====================
    const dispatch = useDispatch();

    const onDeletePost = () => {
        onLoadingStart("Global");
        setError(null);

        dispatch(deleteEvent({ event_id: event.event_id })).then(
            (action) => {
                onLoadingEnd("Global");

                // On Promise Rejected/Failed, Error Exception.
                if (action.error) {
                    // Debug
                    console.log("[On Event Deletion Failed] Payload.", action.payload);

                    setError({
                        name: action.payload.code,
                        code: action.payload.status
                    });
                }
                // On Promise Fulfilled
                else {
                    // Debug
                    console.log("[On Event Deletion Successful] Payload.", action.payload);

                    if (onAfterDeleteCallback)
                        onAfterDeleteCallback();

                    if (onCloseModalCallback)
                        onCloseModalCallback();
                }
            }
        );
    };
    // =====================
    return (
        <>
            <Modal show={show} onHide={onCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Event Deletion?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fs-5 mt-0 mb-3">
                        Note that this action is irreversible once confirmed.
                    </p>
                    {/* Error Message Highlight */}
                    {
                        error ? (
                            <p className="fs-6 text-danger">
                                Something went wrong with the post deletion process. (Error: {error.name}, Code: {error.code})
                            </p>
                        ) : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="rounded-pill" onClick={onDeletePost}>
                        Yes
                    </Button>
                    <Button variant="primary" className="rounded-pill" onClick={onCloseModal}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// =========================================