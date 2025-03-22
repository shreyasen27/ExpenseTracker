import React, { useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWindowSize } from '../../utils/useWindowSize';

function Orb() {
    const { width, height } = useWindowSize();

    console.log("Window Size:", width, height);

    // Prevent animation from using undefined width/height
    const moveOrb = useMemo(() => keyframes`
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${width ? width + "px" : "100px"}, ${height ? height / 2 + "px" : "50px"});
        }
        100% {
            transform: translate(0, 0);
        }
    `, [width, height]);

    const OrbStyled = styled.div`
        width: 70vh;
        height: 70vh;
        position: absolute;
        border-radius: 50%;
        margin-left: -35vh;
        margin-top: -35vh;
        background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
        filter: blur(400px);
        animation: ${moveOrb} 15s alternate linear infinite;
    `;

    return <OrbStyled />;
}

export default Orb;
