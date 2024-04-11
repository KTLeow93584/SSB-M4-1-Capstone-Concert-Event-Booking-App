// ==============================================
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { onLoadingStart, onLoadingEnd } from '../data/loaders.js';
import { updateActiveUser, updateUserInfo } from '../feature/activeUser/activeUserSlice.jsx';

import underConstructionImage from '../assets/images/misc/under-construction.webp';
// ==============================================
/* [Delete Once Understood/Feature Ready] Notes For Profile Feature.
*
* 1. User's Info (E.g. Name/Profile Picture) is currently stored in redux's store, but not cached, thus only accessible within
* active session.
*
* 2. Thus, in the event user completely refresh the page, data from (1) will be gone. This page needs to check if redux's data
* still exists. In the event it doesn't, call from back-end server API.
* - Make use of redux's async thunk from 'activeUserSlice.jsx' to acquire user info from server.
*
* 3. "onLoadingStart"/"onLoadingEnd" are callbacks which can trigger specific loading UIs.
* E.g. Adding "Global" parameter into either or function will trigger a screen-wide/high (100vw, 100vh) loader.
*
* 4. Do utilize the "updateActiveUser" and "updateUserInfo" redux callbacks after user taps on "Save Changes"/equivalent
* "submit" button. This will allow the user to access updated user info from session memory.
*
* 5. [Nice-to-have] Design considerations: Should we cache the active user data? Will there be security risks?
*
* - Viel glück, lehrling!
*/
// ==============================================
export default function EditProfile() {
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
// ==============================================