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
import TextField from '@material-ui/core/TextField';
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
        number: 0,
        position: {x: 0, y: 0},
        onClose: null,
        onConfirm: null,
        onDelete: null,
    };

    handleChangeType = (event) => {
        this.setState({
            type: event.target.value,
        });
    };

    handleChangeNumber = (event) => {
        let number = event.target.value;
        if (number < 0) {
            number = 0;
        }
        this.setState({
            number: number,
        });
    };

    handleChangeXPosition = (event) => {
        this.setState({
            position: { x: event.target.value},
        })
    };

    handleChangeYPosition = (event) => {
        this.setState({
            position: { y: event.target.value},
        })
    };

    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    handleConfirm = () => {
        if (this.props.onConfirm) {
            this.props.onConfirm();
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
                    <FormControl className={classes.formControl}>
                        <TextField
                            label="Number"
                            value={this.state.number}
                            onChange={this.handleChangeNumber}
                            type="number"
                            />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="thruster-type">Type</InputLabel>
                        <Select
                            value={this.state.type}
                            onChange={this.handleChangeType}
                            input={<Input id="thruster-type" />}
                        >
                            <MenuItem value={0}><em>None</em></MenuItem>
                            <MenuItem value={1}>Tunnel</MenuItem>
                            <MenuItem value={2}>Azimuth</MenuItem>
                            <MenuItem value={3}>Rudder</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id="X"
                            placeholder="X position"
                            label="X"
                            value={this.state.position.x}
                            onChange={this.handleChangeXPosition}
                            margin="normal"
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            id="Y"
                            placeholder="Y position"
                            label="Y"
                            value={this.state.position.y}
                            onChange={this.handleChangeYPosition}
                            margin="normal"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={8}>
                        <Grid item xs={3}>
                            <Button onClick={this.handleClose} color="primary" variant='contained' className={classes.button}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={this.handleConfirm} color="primary" variant='contained' className={classes.button}>
                                Ok
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button onClick={this.handleDelete} color="secondary" variant='contained' className={classes.button}>
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
