import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import logo from '../assets/img/AegirDynamics.png';
import captainAvatar from '../assets/img/avatar_captain.png';
import adminAvatar from '../assets/img/avatar_admin.png';
import chiefAvatar from '../assets/img/avatar_cheif.png';
import { colors } from "../config";

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
        backgroundColor: colors.MAIN,
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
    windowTitle: {
        paddingLeft: 160,
        fontWeight: 700,
    },
    menuButton: {
        position: 'absolute',
        right: '20px',
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

    handleLogingDialog = () => {
        return (
            <Dialog onClose={this.handleClose}>
                <DialogTitle id="simple-dialog-title">Choose account</DialogTitle>
                <div>
                    <List>
                        <ListItem
                            button
                            onClick={() => this.handleListItemClick('addAccount')}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt="admin"
                                    src={adminAvatar}
                                />
                            </ListItemAvatar>
                            <ListItemText primary="add account" />
                        </ListItem>
                    </List>
                </div>
            </Dialog>
        );
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
                    <IconButton
                        className={classes.menuButton}
                        aria-haspopup="true"
                        onClick={this.handleLogingDialog}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Header);
