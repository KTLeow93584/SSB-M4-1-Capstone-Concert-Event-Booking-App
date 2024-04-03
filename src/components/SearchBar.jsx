// ==============================================
import { useEffect, useRef, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
// ==============================================
export default function SearchBar({ id = "query-item-name", placeholder = "Search", isPrimaryInputFocus = false, autoSearchOnChange = false,
    onSearchCallback = null, onResetFilterCallback = null }) {
    // ===========================
    const [keyword, setKeyword] = useState("");
    // ===========================
    const startingInputRef = useRef();
    useEffect(() => {
        if (startingInputRef && startingInputRef.current)
            startingInputRef.current.focus();
    }, []);
    // ===========================
    const onSearchKeyword = (currentKeyword) => {
        if (onSearchCallback)
            onSearchCallback(currentKeyword);
        setKeyword("");
    };

    const onResetKeyword = () => {
        setKeyword("");
        if (onResetFilterCallback)
            onResetFilterCallback("");
    };
    // ===========================
    return (
        <div className="d-flex justify-content-start mb-3 w-100 mt-3">
            <div className="d-flex align-items-center w-100 px-2"
                style={{
                    border: "1px #1d9bf0 solid",
                    borderTopLeftRadius: "25px", borderTopRightRadius: "25px",
                    borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px"
                }}>
                {/* Search Button */}
                <Button onClick={() => onSearchKeyword(keyword)}
                    className="d-flex align-items-center justify-content-center ms-auto rounded-circle"
                    style={{ backgroundColor: "transparent", color: "black", border: "none" }}>
                    <i className="bi bi-search"></i>
                </Button>

                {/* Form Control */}
                <Form.Control ref={isPrimaryInputFocus ? startingInputRef : null}
                    type="name" id={id} value={keyword} placeholder={placeholder}
                    style={{ backgroundColor: "transparent", border: "none", boxShadow: "none", borderRadius: "0px" }}
                    onChange={(event) => {
                        const newKeyword = event.target.value;
                        setKeyword(newKeyword);

                        if (autoSearchOnChange)
                            onSearchKeyword(newKeyword);
                    }}
                />

                {/* Clear Query Button*/}
                {
                    keyword ? (
                        <Button onClick={onResetKeyword}
                            className="d-flex align-items-center justify-content-center ms-auto rounded-circle"
                            style={{ backgroundColor: "#1d9bf0", color: "white", border: "none" }}>
                            <FontAwesomeIcon className={"text-center"} style={{ fontSize: "1em" }} icon={faTimes} />
                        </Button>
                    ) : null
                }
            </div>
        </div>
    );
}
// ==============================================