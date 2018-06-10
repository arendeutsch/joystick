import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ThrusterOptions extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        confirmButtonText: PropTypes.string,
        cancelButtonText: PropTypes.string,
        onConfirm: PropTypes.func,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        title: null,
        message: null,
        confirmButtonText: null,
        cancelButtonText: null,
        onConfirm: null,
        onCancel: null,
    };

    state = {
        confirmDisabled: false,
        joystickEnabled: false,
        open: true,
    };

    handleConfirm = () => {
        this.setState({
            confirmDisabled: true,
        }, () => {
            if (this.props.onConfirm) {
                this.props.onConfirm();
            }
        });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    toggleJoyChange = () => {
        this.setState({
            joystickEnabled: !this.state.joystickEnabled,
        });

    };

    render() {
        return (
            <div>
                <Dialog
                    open={true}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <FormControl aria-describedby="name-helper-text">
                                <InputLabel htmlFor="name-helper">X position</InputLabel>
                                <Input id="name-helper" value={this.state.name} onChange={this.handleChange} />
                            </FormControl>
                            <FormControl aria-describedby="name-helper-text">
                                <InputLabel htmlFor="name-helper">Y position</InputLabel>
                                <Input id="name-helper" value={this.state.name} onChange={this.handleChange} />
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!this.state.joystickEnabled}
                                        onChange={this.toggleJoyChange}
                                    />
                                }
                                label="Enable for JOY"
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onCancel} color="primary">
                            {this.props.cancelButtonText}
                        </Button>
                        <Button onClick={this.handleConfirm} color="primary">
                            {this.props.confirmButtonText}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ThrusterOptions;
