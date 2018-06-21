import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    button: {
        width: '100%',
    },
    item: {
        paddingBottom: 0,
        paddingTop: 0,
    },
});

class ThrusterDialog extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        thrusterNode: PropTypes.object,
        onClose: PropTypes.func,
        onConfirm: PropTypes.func,
        onDelete: PropTypes.func,
    };
    state = {
        thrusterNode: null,
        type: 0,
        thrusterNumber: 0,
        position: {x: '', y: ''},
        onClose: null,
        onConfirm: null,
        onDelete: null,
        numberError: true,
        positionXError: true,
        positionYError: true,
        typeError: true,
        disableConfirm: true,
    };

    regEx = new RegExp('^[0-9]+([,.][0-9]+)?$');

    handleChangeType = (event) => {
        const type = event.target.value;
        if (type > 0) {
            this.setState({
                type: type,
                typeError : false,
            }, () => {
                if (!this.state.numberError && !this.state.positionXError && !this.state.positionYError && this.state.thrusterNumber > 0 && !this.state.typeError) {
                    this.setState({
                        disableConfirm: false,
                    });
                } else {
                    this.setState({
                        disableConfirm: true,
                    });
                }
            });
        } else {
            this.setState({
                typeError : true,
            }, () => {
                if (!this.state.numberError && !this.state.positionXError && !this.state.positionYError && this.state.thrusterNumber > 0 && !this.state.typeError) {
                    this.setState({
                        disableConfirm: false,
                    });
                } else {
                    this.setState({
                        disableConfirm: true,
                    });
                }
            });
        }
    };

    handleChangeNumber = (event) => {
        let number = event.target.value;
        if (number < 0) {
            number = 0;
            this.setState({
                thrusterNumber: number,
                numberError: true,
            });
        } else {
            this.setState({
                thrusterNumber: number,
                numberError: false,
            }, () => {
                if (!this.state.numberError && !this.state.positionXError && !this.state.positionYError && this.state.thrusterNumber > 0 && !this.state.typeError) {
                    this.setState({
                        disableConfirm: false,
                    });
                } else {
                    this.setState({
                        disableConfirm: true,
                    });
                }
            });
        }
    };

    handleChangeXPosition = (event) => {
        const x = event.target.value;
        this.setState({
            position: {
                x: x,
                y: this.state.position.y,
            },
            positionXError: !this.regEx.test(x),
        }, ()=> {
            if (!this.state.numberError && !this.state.positionXError && !this.state.positionYError && this.state.thrusterNumber > 0 && !this.state.typeError) {
                this.setState({
                    disableConfirm: false,
                });
            } else {
                this.setState({
                    disableConfirm: true,
                });
            }
        });
    };

    handleChangeYPosition = (event) => {
        const y = event.target.value;
        this.setState({
            position: {
                x: this.state.position.x,
                y: y,
            },
            positionYError: !this.regEx.test(y),
        }, () => {
            if (!this.state.numberError && !this.state.positionXError && !this.state.positionYError && this.state.thrusterNumber > 0 && !this.state.typeError) {
                this.setState({
                    disableConfirm: false,
                });
            } else {
                this.setState({
                    disableConfirm: true,
                });
            }
        });
    };

    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    handleConfirm = () => {
        if (this.props.onConfirm) {
            this.props.onConfirm(this.props.thrusterNode,
                this.state.type,
                this.state.thrusterNumber,
                this.state.position);
        }
    };

    handleDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.thrusterNode);
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                disableBackdropClick
                open={true}
                onClose={this.handleClose}
            >
                <DialogTitle>Thruster Configuration</DialogTitle>
                <DialogContent>
                    <FormControl className={classes.formControl} error={this.state.numberError} required={true}>
                        <InputLabel htmlFor="number">Number</InputLabel>
                        <Input
                            id="number"
                            value={this.state.thrusterNumber}
                            onChange={this.handleChangeNumber}
                            type="number"
                            />
                    </FormControl>
                    <FormControl className={classes.formControl} error={this.state.typeError} required={true}>
                        <InputLabel htmlFor="thruster-type">Type</InputLabel>
                        <Select
                            value={this.state.type}
                            onChange={this.handleChangeType}
                            input={<Input id="thruster-type" />}
                        >
                            <MenuItem className={classes.item} value={0}><em>None</em></MenuItem>
                            <MenuItem className={classes.item} value={1}>Tunnel</MenuItem>
                            <MenuItem className={classes.item} value={2}>Azimuth</MenuItem>
                            <MenuItem className={classes.item} value={3}>Rudder</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl} error={this.state.positionXError} required={true}>
                        <InputLabel htmlFor="X">X</InputLabel>
                        <Input
                            id="X"
                            placeholder="X position"
                            value={this.state.position.x}
                            onChange={this.handleChangeXPosition}
                            type="text"
                        />
                    </FormControl>
                    <FormControl className={classes.formControl} error={this.state.positionYError} required={true}>
                        <InputLabel htmlFor="Y">Y</InputLabel>
                        <Input
                            id="Y"
                            placeholder="Y position"
                            value={this.state.position.y}
                            onChange={this.handleChangeYPosition}
                            type="text"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={8}>
                        <Grid item xs={3}>
                            <Button
                                onClick={this.handleClose}
                                color="primary"
                                variant='contained'
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={this.handleConfirm}
                                color="primary"
                                variant='contained'
                                className={classes.button}
                                disabled={this.state.disableConfirm}
                            >
                                Ok
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                onClick={this.handleDelete}
                                color="secondary"
                                variant='contained'
                                className={classes.button}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(ThrusterDialog);
