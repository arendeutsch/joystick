import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import blueGrey from '@material-ui/core/colors/blueGrey';
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
    MAIN: blueGrey[600],
    ALARM: red[500],
    WARNING: yellow[500],
};

const theme = createMuiTheme({
    palette: {
        primary: { main: blueGrey[600] },
        secondary: { main: red[600] },
    },
});

export {
    tabIds,
    alarmType,
    colors,
    theme,
};