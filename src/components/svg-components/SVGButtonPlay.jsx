// =========================================
import './SVGButton.css';

/*
    Original Button Design (Before transformed into responsive % widths, heights and coordinates)

    <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <!-- Circular Outline -->
        <circle id="button-outline" r="75" cx="75" cy="75" stroke="#cccccc" stroke-width="4" fill="transparent" />

        <!-- Draw play button (triangle) -->
        <polygon id="button-arrow" points="45,45 45,115 120,80"
            stroke="black" stroke-width="0.3" fill="white" />
    </svg>
*/
// =========================================
export default function SVGButtonPlay({ width = 150, height = 150, onClick, className }) {
    // Calculate coordinates relative to width and height
    const arrowPoints = `${width * 0.3},${height * 0.3} ${width * 0.3},${height * 0.7} ${width * 0.8},${height * 0.5}`;

    return (
        <div onClick={onClick} style={{ width, height }}>
            <svg className={`${className} rounded-circle`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                {/* Circular Outline */}
                <circle id="button-outline" r={width / 2} cx={width / 2} cy={height / 2} stroke="#cccccc" strokeWidth="4" fill="transparent" />

                {/* Draw play button (triangle) */}
                <polygon id="button-arrow" points={arrowPoints} stroke="black" strokeWidth="0.3" fill="white" />
            </svg>
        </div>
    );
}
// =========================================