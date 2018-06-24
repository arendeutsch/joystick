import React from 'react';

import Joy from 'react-joystick';
import axios from 'axios';

const joyOptions = {
    mode: 'semi',
    position: {left: '50%', top: '50%'},
    color: '#000',
    restJoystick: false
};

const joyStyle = {
    position: 'relative',
    height: '240px',
    width: '240px',
    background: '#323438',
    opacity: 0.75,
};

class Joystick extends React.Component {

    managerListener = (manager) => {
        manager.on('move', (e, stick) => {
            axios.post('http://localhost:8080/vessel/jcmd', {
                thrust: (stick.distance * 2).toString(),
                angleDeg: stick.angle.degree.toString(),
                angleRad: stick.angle.radian.toString(),
            });
        });
        manager.on('end', () => {
            console.log('I ended!')
        });
    };

    render() {
        return (
            <div>
                <Joy
                    joyOptions={joyOptions}
                    containerStyle={joyStyle}
                    managerListener={this.managerListener}
                />
            </div>
        );
    }
}

export default Joystick;
