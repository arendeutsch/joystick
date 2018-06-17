import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { createMuiTheme } from '@material-ui/core/styles';

const tabIds = {
    HOME: 1,
    MAPS: 2,
    ALARMS: 3,
    SETTINGS: 4,
    JOYSTICK: 5,
    BUILD: 6,
};

const alarmType = {
    1: 'ALM',
    2: 'WRN',
    3: 'ERR',
};

const colors = {
    MAIN: '#5f9ea0',
    ALARM: red[500],
    WARNING: yellow[500],
};

const theme = createMuiTheme({
    palette: {
        primary: { main: '#5f9ea0' },
        secondary: { main: red[500] },
    },
});

export {
    tabIds,
    alarmType,
    colors,
    theme,
};