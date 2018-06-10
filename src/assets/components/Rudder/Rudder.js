import React from 'react';
import PropTypes from 'prop-types';
import { Group, Arc, RegularPolygon } from 'react-konva';

class Rudder extends React.Component {

    render() {

        return(
            <Group
                draggable={true}
                x={270}
                y={350}
            >
            <Arc
                //x={270}
                //y={350}
                innerRadius={21}
                outerRadius={30}
                angle={135}
                rotation={22}
                fill={'#6b7879'}
                stroke={'black'}
                strokeWidth={1.2}
            />
                <Group
                    x={0}
                    y={25}
                    rotation={45}
                >
                    <RegularPolygon
                        //x={270}
                        //y={375}
                        sides={3}
                        radius={3.7}
                        rotation={180}
                        fill={'black'}
                        stroke={'black'}
                        strokeWidth={1}
                    />
                </Group>
        </Group>
        );
    }
}
export default Rudder;