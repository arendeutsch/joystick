import React from 'react';
import PropTypes from 'prop-types';
import { Ring, Rect, Group, RegularPolygon } from 'react-konva';


class Azimuth extends React.Component {
    static propTypes = {
        number: PropTypes.number,
        thrust: PropTypes.number,
        position: PropTypes.object,
        background: PropTypes.string,
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number,
        angle: PropTypes.number,
        draggable: PropTypes.bool,
        showThrusterOptions: PropTypes.func,
        onDrag: PropTypes.func,
        scale: PropTypes.number,
        opacity: PropTypes.number,
        shadowOpacity: PropTypes.number,
        shadowColor: PropTypes.string,
        shadowBlur: PropTypes.number,
        shadowOffset: PropTypes.object,
        scale: PropTypes.object,
        scaleStart: PropTypes.number,


    };

    static defaultProps = {
        number: 0,
        thrust: 0,
        position: {x: 0, y: 0},
        background: '#b5b6bc',
        strokeColor: 'black',
        strokeWidth: 1.2,
        onDrag: null,

        angle: 0,
        draggable: false,
        showThrusterOptions: null,

    };

    state = {
        angle: this.props.angle,
        thrust: this.props.thrust,
        draggable: this.props.draggable,
        strokeColor: this.props.strokeColor,
        strokeWidth: this.props.strokeWidth,
        thrusterOptions: null,
    };

    handleOnClick = () => {
        this.showThrusterOptions(this.props.number);
    };

    showThrusterOptions = (number) => {
        if (this.props.showThrusterOptions) {
            this.props.showThrusterOptions(number);
        }
    };

    render () {
        return (
            <Group
                draggable={this.state.draggable}
                rotation={this.state.angle}
                x={this.props.position.x}
                y={this.props.position.y}
                onClick={this.handleOnClick}
                opacity={this.props.opacity}
                shadowOpacity={this.props.shadowOpacity}
                shadowColor={this.props.shadowColor}
                shadowBlur={this.props.shadowBlur}
                shadowOffset={this.props.shadowOffset}
                scale={this.props.scale}
                startScale={this.props.scaleStart}
            >
                <Ring
                    innerRadius={40}
                    outerRadius={55}
                    fill={this.props.background}
                    stroke={this.state.strokeColor}
                    strokeWidth={this.state.strokeWidth}
                />
                <Rect
                    x={-7}
                    y={-37}
                    width={14}
                    height={74}
                    fillLinearGradientStartPoint={{x:0,y:0}}
                    fillLinearGradientEndPoint={{x:14, y:74}}
                    fillLinearGradientColorStops={[0, this.props.background, (100 - this.state.thrust)/100, this.props.background, (100 -this.state.thrust + 5)/100, '#1465c1', 1, '#2b53cc']}
                    // second and third point changes dynamically to create graduate fill effect.
                    // second point should always be a bit lower than third point
                    cornerRadius={3}
                    stroke={'black'}
                    strokeWidth={1.2}
                />
                <RegularPolygon
                    x={0}
                    y={-45}
                    sides={3}
                    radius={6.5}
                    fill={'black'}
                    stroke={'black'}
                    strokeWidth={1}
                />
            </Group>
        );
    }
}
export default Azimuth;