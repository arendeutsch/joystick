import React from 'react';
import PropTypes from 'prop-types';
import { Ring } from 'react-konva';


class AzimuthRing extends React.Component {
    static propTypes = {
        position: PropTypes.object,
        background: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number,
        draggable: PropTypes.bool,
        onDrag: PropTypes.func,
        opacity: PropTypes.number,
        shadowOpacity: PropTypes.number,
        shadowColor: PropTypes.string,
        shadowBlur: PropTypes.number,
        shadowOffset: PropTypes.object,
        scale: PropTypes.object,
        scaleStart: PropTypes.number,
    };

    static defaultProps = {
        position: {x: 0, y: 0},
        background: '#b5b6bc',
        strokeColor: 'black',
        strokeWidth: 1.2,
        draggable: true,
    };

    render () {
        return (
                <Ring
                    x={this.props.position.x}
                    y={this.props.position.y}
                    innerRadius={40}
                    outerRadius={55}
                    fill={this.props.background}
                    stroke={this.props.strokeColor}
                    strokeWidth={this.props.strokeWidth}
                    opacity={this.props.opacity}
                    shadowOpacity={this.props.shadowOpacity}
                    shadowColor={this.props.shadowColor}
                    shadowBlur={this.props.shadowBlur}
                    shadowOffset={this.props.shadowOffset}
                    scale={this.props.scale}
                    startScale={this.props.scaleStart}
                    draggable={this.props.draggable}
                />
        );
    }
}
export default AzimuthRing;