// =========================================
import './SVGIconArrow.css';

/*
    Original Button Design (Before transformed into responsive % widths, heights and coordinates)

    <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
        <!-- Draw the arrow shape via paths -->
        <path id="button-arrow"
            d="M 45 22 h-45 v 15 h 45
            C 45 37 49 47	40 49 
            C 40 49 57 59	80 29.5 
            C 80 29.5 57 0 40 10 
            C 40 10 49 18 45 22 h-2"
            stroke="black" strokeWidth="1" fill="white"
            />
    </svg>
*/
// =========================================
export default function SVGIconArrow({ width = 80, height = 60, onClick, className }) {
    // Calculate scale factor based on the default width and height (150x150)
    const scaleFactor = { x: width / 80, y: height / 60 }

    // Calculate adjusted coordinates for the path
    const adjustCoordinateX = (coordinate) => coordinate * scaleFactor.x;
    const adjustCoordinateY = (coordinate) => coordinate * scaleFactor.y;

    // Adjusted path data
    const adjustedPathData = `M ${adjustCoordinateX(45)} ${adjustCoordinateY(22)} h-${adjustCoordinateX(45)} v${adjustCoordinateY(15)} h${adjustCoordinateX(45)}
          C ${adjustCoordinateX(45)} ${adjustCoordinateY(37)} ${adjustCoordinateX(49)} ${adjustCoordinateY(47)} ${adjustCoordinateX(40)} ${adjustCoordinateY(49)} 
          C ${adjustCoordinateX(40)} ${adjustCoordinateY(49)} ${adjustCoordinateX(57)} ${adjustCoordinateY(59)} ${adjustCoordinateX(80)} ${adjustCoordinateY(29.5)} 
          C ${adjustCoordinateX(80)} ${adjustCoordinateY(29.5)} ${adjustCoordinateX(57)} ${adjustCoordinateY(0)} ${adjustCoordinateX(40)} ${adjustCoordinateY(10)} 
          C ${adjustCoordinateX(40)} ${adjustCoordinateY(10)} ${adjustCoordinateX(49)} ${adjustCoordinateY(18)} ${adjustCoordinateX(45)} ${adjustCoordinateY(22)} h-${adjustCoordinateY(2)}`;

    return (
        <div className="svg-icon-group" onClick={onClick} style={{ width: "10vw", height: "10vh" }}>
            <svg className={`${className}`}
                viewBox={`0 0 ${width} ${height}`}
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet">
                {/* Draw the arrow shape via paths */}
                <path id="icon-arrow"
                    d={adjustedPathData}
                    stroke="black" strokeWidth="0.3" fill="white"
                />
            </svg>
        </div>
    );
}
// =========================================