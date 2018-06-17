import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-konva';

class Boat extends React.Component {

    static propTypes = {
        onVesselClick: PropTypes.func,
    };

    state = {
        // points: [285, 10,
        //          80, 250,
        //          80, 750,
        //          490, 750,
        //          490, 250
        // ],
        points: [39, 168, 153, 13, 219, 12, 322, 173, 325, 174, 336, 257, 333, 346, 330, 346, 278, 375, 74, 384, 34, 352, 33, 353, 31, 238, 38, 171],
        color: '#b5b6bc',
        stroke: '#000'
    };

    handleOnClick = () => {
        if (this.props.onVesselClick) {
            this.props.onVesselClick();
        }
    };

    render () {
        return (
            <Line
                points={this.state.points}
                fill={this.state.color}
                stroke={this.state.stroke}
                strokeWidth={5}
                closed={true}
                // tension={0.17}
                bezier={true}
                onClick={this.props.handleOnClick}
            />
        );
    }
}

export default Boat;