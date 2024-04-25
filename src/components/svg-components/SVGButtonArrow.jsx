// =========================================
import './SVGButton.css';

/*
    Original Button Design (Before transformed into responsive % widths, heights and coordinates)

    <svg width="150px" height="150px" xmlns="http://www.w3.org/2000/svg">
        <!-- Circular Outline -->
        <circle id="button-outline" r="75" cx="75" cy="75" stroke="#cccccc" stroke-width="4" fill="transparent" />

        <!-- Draw the arrow shape via paths -->
        <path id="button-arrow"
            d="M 90 67.5 h-45 v 15 h 45 
                C 90 82.5 94 92.5 85 94.5 C 85 94.5 102 104.5 125 75 
                C 125 75 102 45.5 85 55.5 C 85 55.5 94 63.5 90 67.5 h-2"
            stroke="black" strokeWidth="0.3" fill="white"
        />
    </svg>
*/
// =========================================
export default function SVGButtonArrow({ width = 150, height = 150, onClick, className }) {
    // Calculate scale factor based on the default width and height (150x150)
    const scaleFactor = Math.min(width, height) / 150;

    // Calculate adjusted coordinates for the path
    const adjustCoordinate = (coordinate) => coordinate * scaleFactor;

    // Adjusted path data
    const adjustedPathData = `M ${adjustCoordinate(90)} ${adjustCoordinate(67.5)} h-${adjustCoordinate(45)} v${adjustCoordinate(15)} h${adjustCoordinate(45)}
          C ${adjustCoordinate(90)} ${adjustCoordinate(82.5)} ${adjustCoordinate(94)} ${adjustCoordinate(92.5)} ${adjustCoordinate(85)} ${adjustCoordinate(94.5)} 
          C ${adjustCoordinate(85)} ${adjustCoordinate(94.5)} ${adjustCoordinate(102)} ${adjustCoordinate(104.5)} ${adjustCoordinate(125)} ${adjustCoordinate(75)} 
          C ${adjustCoordinate(125)} ${adjustCoordinate(75)} ${adjustCoordinate(102)} ${adjustCoordinate(45.5)} ${adjustCoordinate(85)} ${adjustCoordinate(55.5)} 
          C ${adjustCoordinate(85)} ${adjustCoordinate(55.5)} ${adjustCoordinate(94)} ${adjustCoordinate(63.5)} ${adjustCoordinate(90)} ${adjustCoordinate(67.5)} h-${adjustCoordinate(2)}`;

    // Circular radius
    const radius = adjustCoordinate(75);

    return (
        <div onClick={onClick} style={{ width: "10vw", height: "10vh" }}>
            <svg className={`${className}`}
                viewBox={`0 0 ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet">
                {/* Circular Outline */}
                <circle id="button-outline" r={radius} cx={width / 2} cy={height / 2} stroke="#cccccc" strokeWidth="4" fill="transparent" />

                {/* Draw the arrow shape via paths */}
                <path id="button-arrow"
                    d={adjustedPathData}
                    stroke="black" strokeWidth="0.3" fill="white"
                />
            </svg>
        </div>
    );
}
// =========================================