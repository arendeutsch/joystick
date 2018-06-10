import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import logo from '../assets/img/anchor-avatar.png';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#5f9ea0',
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
    windowTitle: {
        paddingLeft: 160,
        fontWeight: 700,
    },
});

class Header extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        title: PropTypes.string,
    };

    static defaultProps = {
        title: 'Joystick App',
    };

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar>
                    <Avatar
                        alt="logo"
                        src={logo}
                        className={classes.bigAvatar}
                    />
                    <Typography variant="title" color="inherit" noWrap className={classes.windowTitle}>
                        {this.props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Header);
