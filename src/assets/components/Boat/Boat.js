import React from 'react';
import { Line } from 'react-konva';

class Boat extends React.Component {

    state = {
        // points: [200, 10, 100, 100, 100, 380, 300, 380, 300, 100],
        points: [285, 10,
                 80, 250,
                 80, 750,
                 490, 750,
                 490, 250
        ],
        color: '#b5b6bc',
        stroke: '#000'
    };

    render () {
        return (
            <Line
                points={this.state.points}
                fill={this.state.color}
                stroke={this.state.stroke}
                strokeWidth={5}
                closed={true}
                tension={0.17}
            />
        );
    }
}

export default Boat;