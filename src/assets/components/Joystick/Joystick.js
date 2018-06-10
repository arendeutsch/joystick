import React from 'react';

import Joy from 'react-joystick';

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
            console.log(stick.angle);
            console.log(stick.distance);
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
