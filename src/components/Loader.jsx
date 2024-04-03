// =========================================
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import { loadStartPrefix, loadEndPrefix } from '../data/loaders.js';
// =========================================
export default function Loader() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onLoadingStartCallback = () => setIsVisible(true);
        const onLoadingEndCallback = () => setIsVisible(false);

        window.addEventListener(loadStartPrefix + "Global", onLoadingStartCallback);
        window.addEventListener(loadEndPrefix + "Global", onLoadingEndCallback);
        return (() => {
            window.removeEventListener(loadStartPrefix + "Global", onLoadingStartCallback);
            window.removeEventListener(loadEndPrefix + "Global", onLoadingEndCallback);
        });
    }, []);

    // <div id="loader" />
    return (
        <div id="loader-container" className={`${isVisible ? "d-block" : "d-none"}`}>
            <Spinner animation="border" id="loader" variant="primary" />
        </div>
    );
}
// =========================================