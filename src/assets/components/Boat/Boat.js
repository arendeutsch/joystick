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
        points: [405, 38, 689, 82, 697, 297, 399, 356, 399, 356, 179, 356, 28, 360, 22, 359, 4, 279, 1, 143, 17, 38, 25, 32, 160, 33, 403, 38],
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