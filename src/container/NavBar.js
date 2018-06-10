import React from 'react';
import PropTypes from 'prop-types';

import { tabIds } from '../config';

import Joystick from '../assets/components/Joystick/Joystick';

import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import JoyIcon from '@material-ui/icons/Gamepad';
import JoystickIcon from '@material-ui/icons/VideogameAsset';
import MapIcon from '@material-ui/icons/MyLocation';
import SettingsIcon from '@material-ui/icons/Settings';
import AlarmIcon from '@material-ui/icons/Notifications';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PrinterIcon from '@material-ui/icons/Print';
import Collapse from '@material-ui/core/Collapse';

const drawerWidth = 240;

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class NavBar extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        onTabChange: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            thrusterOptions: null,
            expandSettingsList: false,
            expandJoystickList: false,
            activeTab: 0,
        };
    }

    handleListExpand = (expandList) => {
        switch (expandList) {
            case tabIds.SETTINGS:
                this.setState({expandSettingsList: !this.state.expandSettingsList});
                break;
            case tabIds.JOYSTICK:
                this.setState({expandJoystickList: !this.state.expandJoystickList});
                break;
        }
    };

    handleTabChange = (tabId) => {
        if (this.props.onTabChange) {
            this.props.onTabChange(tabId);
        }
    };

    render () {
        const { classes } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar}/>
                <List component="nav">
                    <ListItem button onClick={this.handleTabChange.bind(this, tabIds.HOME)}>
                        <ListItemIcon>
                            <JoyIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <ListItem button onClick={this.handleTabChange.bind(this, tabIds.MAPS)}>
                        <ListItemIcon>
                            <MapIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Map"/>
                    </ListItem>
                    <ListItem button onClick={this.handleTabChange.bind(this, tabIds.ALARMS)}>
                        <ListItemIcon>
                            <AlarmIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Alarms"/>
                    </ListItem>
                    <ListItem button onClick={this.handleListExpand.bind(this, tabIds.SETTINGS)}>
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        <ListItemText inset primary="Settings"/>
                        {this.state.expandSettingsList ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={this.state.expandSettingsList} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <PrinterIcon/>
                                </ListItemIcon>
                                <ListItemText inset primary="Print Page"/>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
                <Divider/>
                <ListItem button onClick={this.handleListExpand.bind(this, tabIds.JOYSTICK)}>
                    <ListItemIcon>
                        <JoystickIcon/>
                    </ListItemIcon>
                    <ListItemText inset primary="Joystick" secondary="Press to use"/>
                    {this.state.expandJoystickList ? <ExpandLess/> : <ExpandMore/>}
                </ListItem>
                <Collapse in={this.state.expandJoystickList} timeout="auto" unmountOnExit>
                    <Joystick />
                </Collapse>
            </Drawer>
        );
    }
}

export default withStyles(styles)(NavBar);
