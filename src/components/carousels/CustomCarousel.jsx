// =========================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import SVGButtonArrow from '../svg-components/SVGButtonArrow.jsx';

import './CustomCarousel.css';
// =========================================
export default function CustomCarousel({ items, maxCarouselItemPerRow }) {
    // ================
    const startX = useRef(0);
    const carouselTransitionType = "transform 0.3s ease";

    const [isMouseDownOnCarousel, setIsMouseDownOnCarousel] = useState(false);
    const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
    const [currentBoundsX, setCurrentBoundsX] = useState({ startX: 0, width: 0 });
    const [firstDeltaX, setFirstDeltaX] = useState(0);
    const [latestDeltaX, setLatestDeltaX] = useState(0);
    const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);

    const carouselElementRef = useRef(null);
    const carouselElementItemsRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const maxIndex = Math.ceil(items.length / maxCarouselItemPerRow);

    const onUpdateActiveIndex = (newIndex) => {
        if (carouselElementItemsRef.current) {
            setIsCarouselTransitioning(true);
            carouselElementItemsRef.current.style.transition = carouselTransitionType;
        }

        if (newIndex < 0)
            newIndex = maxIndex - 1;
        else if (newIndex >= maxIndex)
            newIndex = 0;

        setActiveIndex(newIndex);
    };

    // ================
    const onMouseMovedCarousel = (event) => {
        if (!isMouseDownOnCarousel || event.clientX === startX.current)
            return;

        const mousePosition = { x: event.clientX, y: event.clientY };
        const deltaX = mousePosition.x - currentMousePosition.x;

        setLatestDeltaX(-deltaX);
        if (firstDeltaX === 0)
            setFirstDeltaX(-deltaX);
        if (deltaX !== 0)
            setIsCarouselTransitioning(false);

        let elementWidth = 0;
        if (carouselElementRef.current)
            elementWidth = carouselElementRef.current.offsetWidth;

        let newIndexPosition = activeIndex - (deltaX / elementWidth);
        if (newIndexPosition > items.length - 1)
            newIndexPosition = items.length - 1;
        else if (newIndexPosition < 0)
            newIndexPosition = 0;

        setActiveIndex(newIndexPosition);

        // Debug
        //console.log("[On Mouse Movement] Values. [Delta, Previous Mouse Position, Current Mouse Position, Original Index, New Index, Element Width]",
        //  [deltaX, currentMousePosition.x, mousePosition.x, activeIndex, newIndexPosition, carouselElementRef.current.offsetWidth]);

        setCurrentMousePosition(mousePosition);
    };
    // ================
    const onMouseDownCarousel = (event) => {
        const mousePosition = { x: event.clientX, y: event.clientY };

        setCurrentMousePosition(mousePosition);
        setIsMouseDownOnCarousel(true);

        // Debug
        //console.log("[On Mouse Down] Transition Flag.", isCarouselTransitioning);

        if (carouselElementItemsRef.current) {
            if (isCarouselTransitioning) {
                const bounds = carouselElementItemsRef.current.getBoundingClientRect();
                const currentIndex = Math.abs((bounds.x - currentBoundsX.startX) / currentBoundsX.width);

                // Debug
                //console.log("[On Mouse Down] Values, [Current X, Start X, Width, Index].", 
                //  [bounds.x, currentBoundsX.startX, currentBoundsX.width, currentIndex]);

                setActiveIndex(currentIndex);
            }

            carouselElementItemsRef.current.style.transition = "none";
        }

        // Debug
        //console.log("Mouse is Down on Carousel Component.");
    };
    // ================
    const translatePercent = activeIndex * 100;

    const onMouseUpCarousel = useCallback(() => {
        setIsMouseDownOnCarousel(false);

        let newIndex = activeIndex;

        // E.g.
        // First Frame -> My mouse moved to the right.
        // Last Frame -> My mouse also moved to the right.
        // Move to next.
        if (Math.sign(firstDeltaX) === Math.sign(latestDeltaX)) {
            newIndex = (firstDeltaX > 0) ? (Math.round(Math.min(items.length - 1, activeIndex + 1))) :
                ((firstDeltaX < 0) ? Math.round(Math.max(0, activeIndex - 1)) : Math.round(activeIndex));
        }
        // Otherwise, round to nearest round number (index of carousel item to show) and transition.
        else
            newIndex = Math.round(newIndex);

        setActiveIndex(newIndex);

        // Debug
        //console.log("[On Mouse Up] Values [First X Delta, Latest X Delta, New Carousel Item Index, Flag] .",
        //    [firstDeltaX, latestDeltaX, newIndex, isCarouselTransitioning]);

        if (carouselElementItemsRef.current && (isCarouselTransitioning || firstDeltaX !== 0)) {
            if (!isCarouselTransitioning)
                setIsCarouselTransitioning(true);
            carouselElementItemsRef.current.style.transition = carouselTransitionType;
        }

        setFirstDeltaX(0);
        setLatestDeltaX(0);
    }, [firstDeltaX, latestDeltaX, activeIndex, items.length, isCarouselTransitioning]);

    useEffect(() => {
        if (carouselElementItemsRef.current != null) {
            const bounds = carouselElementItemsRef.current.getBoundingClientRect();
            const resultantBoundsX = { startX: bounds.x, width: bounds.width };

            setCurrentBoundsX(resultantBoundsX);

            // Debug
            //console.log("[On Initialize Carousel] Bounds: ", resultantBoundsX);
        }
    }, [items.length]);

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUpCarousel);

        return (() => {
            window.removeEventListener("mouseup", onMouseUpCarousel);
        })
    }, [onMouseUpCarousel]);
    // ================
    return (
        <Col className="col-12 custom-carousel" ref={carouselElementRef}>
            {/* -------------------------------------- */}
            {/* Carousel Content Group */}
            <div className="custom-carousel-items-group" ref={carouselElementItemsRef}
                onMouseDown={onMouseDownCarousel}
                onMouseMove={onMouseMovedCarousel}
                style={{
                    transform: `translate(-${translatePercent}%)`,
                    cursor: (isMouseDownOnCarousel ? "grabbing" : "grab"),
                    transition: "none"
                }}
                onTransitionEnd={() => {
                    // Debug
                    //console.log("[On Carousel Transition End] Hello!");

                    setIsCarouselTransitioning(false);
                }}>
                <CarouselItems items={items} maxCarouselItemPerRow={maxCarouselItemPerRow} />
            </div>
            {/* -------------------------------------- */}
            {/* Buttons Group */}

            {/* Previous Button */}
            {
                activeIndex >= 1 ? (
                    <button
                        className="custom-carousel-previous-button"
                        onClick={() => onUpdateActiveIndex(activeIndex - 1)}>
                    </button>
                ) : null
            }

            {/* Next Button */}
            {
                activeIndex <= items.length - 2 ? (
                    <button
                        className="custom-carousel-next-button"
                        onClick={() => onUpdateActiveIndex(activeIndex + 1)}>
                    </button>
                ) : null
            }

            {/* Indicator Buttons */}
            <div className="custom-carousel-indicator-button-group">
                <CarouselIndicatorButtons
                    maxIndex={maxIndex}
                    activeIndex={activeIndex}
                    onUpdateActiveIndex={onUpdateActiveIndex}
                />
            </div>
            {/* -------------------------------------- */}
        </Col>
    );
}
// =========================================
function CarouselIndicatorButtons({ maxIndex, activeIndex, onUpdateActiveIndex }) {
    const elements = [];

    for (let index = 0; index < maxIndex; ++index) {
        elements.push(
            <button key={`custom-carousel-indicator-button-${index}`}
                className={`custom-carousel-indicator-button ${activeIndex === index ? "custom-carousel-indicator-button-active" : ""}`}
                onClick={() => onUpdateActiveIndex(index)}>
            </button>
        );
    }
    return elements;
}
// =========================================
function CarouselItems({ items, maxCarouselItemPerRow }) {
    const elements = [];
    for (let i = 0; i < items.length; i += maxCarouselItemPerRow) {

        const carouselSectionItems = [];
        for (let j = i; j < Math.min(items.length, i + maxCarouselItemPerRow); ++j)
            carouselSectionItems.push(items[j]);

        const groupIndex = i / maxCarouselItemPerRow;

        elements.push(
            <CarouselItemGroup key={`custom-carousel-item-group-${groupIndex}`}
                items={carouselSectionItems}
                groupIndex={groupIndex} />
        );
    }
    return elements;
}

function CarouselItemGroup({ items, groupIndex }) {
    return (
        <div className="custom-carousel-item">
            {
                items.map((item, index) =>
                    <CarouselItemElement
                        key={`custom-carousel-item-${groupIndex}-element-${index}`}
                        item={item}
                        elementWidth={(100 / items.length)}
                        itemIndex={index} />
                )
            }
        </div>
    );
}

function CarouselItemElement({ item, elementWidth, itemIndex }) {
    const showDebug = false;
    const navigate = useNavigate();

    return (
        <div className="custom-carousel-item-element"
            style={{
                width: `${elementWidth}%`,
                backgroundColor: `${showDebug ? (itemIndex % 2 === 0 ? "green" : "teal") : "transparent"}`
            }}>
            <Image className="custom-carousel-item-element-img"
                src={item.imageURL}
                draggable="false"
                alt={item.caption}
            />
            <div className="d-flex align-items-center custom-carousel-item-element-caption">
                <h5 className="custom-carousel-item-element-caption-text">{item.caption}</h5>
                <SVGButtonArrow width="95" height="95"
                    onClick={() => navigate("#")}
                    className="custom-carousel-item-element-caption-button" />
            </div>
        </div>
    );
}
// =========================================