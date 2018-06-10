import React from 'react';
import PropTypes from 'prop-types';
import { Rect, Group } from 'react-konva';

class Tunnel extends React.Component {

    render() {
        return (
            <Group
                draggable={true}
            >
                <Rect
                    x={387}
                    y={140}
                    rotation={90}
                    width={18}
                    height={200}
                    fillLinearGradientStartPoint={{x:0,y:0}}
                    fillLinearGradientEndPoint={{x:18, y:200}}
                    fillLinearGradientColorStops={[0, '#b5b6bc', 0.25, '#b5b6bc', 0.3, '#1465C1', 1, '#2B53CC']}
                    cornerRadius={3}
                    stroke={'black'}
                    strokeWidth={1.2}
                />
            </Group>
        );
    }

}
export default Tunnel;