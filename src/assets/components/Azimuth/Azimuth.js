import React from 'react';
import PropTypes from 'prop-types';
import { Ring, Rect, Group, RegularPolygon } from 'react-konva';


class Azimuth extends React.Component {
    static propTypes = {
        setRef: PropTypes.object,
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
        opacity: PropTypes.number,
        shadowOpacity: PropTypes.number,
        shadowColor: PropTypes.string,
        shadowBlur: PropTypes.number,
        shadowOffset: PropTypes.object,
        scale: PropTypes.object,
        scaleStart: PropTypes.number,
        onHandleMouseDown: PropTypes.func,
        onHandleDragStart: PropTypes.func,
        onHandleDragEnd: PropTypes.func,


    };

    static defaultProps = {
        number: 0,
        thrust: 0,
        position: {x: 0, y: 0},
        background: '#b5b6bc',
        strokeColor: 'black',
        strokeWidth: 1.2,
        onDrag: null,
        onMouseDown: null,
        onDragStart: null,
        onDragEnd: null,
        angle: 0,
        draggable: false,
        showThrusterOptions: null,
    };

    state = {
        angle: this.props.angle,
        thrust: this.props.thrust,
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

    handleMouseDown = () => {
        if (this.props.onHandleMouseDown) {
            this.props.onHandleMouseDown();
        }
    };

    handleDragStart = () => {
        if (this.props.onHandleDragStart) {
            this.props.onHandleDragStart();
        }
    };

    handleDragEnd = () => {
        if (this.props.onHandleDragEnd) {
            this.props.onHandleDragEnd();
        }
    };

    render () {
        return (
            <Group
                ref={this.props.setRef}
                draggable={this.props.draggable}
                rotation={this.state.angle}
                x={this.props.position.x}
                y={this.props.position.y}
                opacity={this.props.opacity}
                shadowOpacity={this.props.shadowOpacity}
                shadowColor={this.props.shadowColor}
                shadowBlur={this.props.shadowBlur}
                shadowOffset={this.props.shadowOffset}
                scale={this.props.scale}
                startScale={this.props.scaleStart}
                onClick={this.handleOnClick}
                onMouseDown={this.handleMouseDown}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
            >
                <Ring
                    innerRadius={40}
                    outerRadius={55}
                    fill={this.props.background}
                    stroke={this.state.strokeColor}
                    strokeWidth={this.state.strokeWidth}
                    opacity={this.props.opacity}
                    shadowOpacity={this.props.shadowOpacity}
                    shadowColor={this.props.shadowColor}
                    shadowBlur={this.props.shadowBlur}
                    shadowOffset={this.props.shadowOffset}
                    scale={this.props.scale}
                    startScale={this.props.scaleStart}
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
                    opacity={this.props.opacity}
                    shadowOpacity={this.props.shadowOpacity}
                    shadowColor={this.props.shadowColor}
                    shadowBlur={this.props.shadowBlur}
                    shadowOffset={this.props.shadowOffset}
                    scale={this.props.scale}
                    startScale={this.props.scaleStart}
                />
                <RegularPolygon
                    x={0}
                    y={-45}
                    sides={3}
                    radius={6.5}
                    fill={'black'}
                    stroke={'black'}
                    strokeWidth={1}
                    opacity={this.props.opacity}
                    shadowOpacity={this.props.shadowOpacity}
                    shadowColor={this.props.shadowColor}
                    shadowBlur={this.props.shadowBlur}
                    shadowOffset={this.props.shadowOffset}
                    scale={this.props.scale}
                    startScale={this.props.scaleStart}
                />
            </Group>
        );
    }
}
export default Azimuth;