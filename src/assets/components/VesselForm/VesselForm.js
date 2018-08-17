import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MomenUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import { DatePicker } from 'material-ui-pickers';
import axios from "axios/index";


const styles = ({
    paper: {
        width: 910,
        height: window.innerHeight - 300,
        padding: '15px',
    },
    textField: {
        width: '100%'
    },
    item: {
        paddingBottom: 0,
        paddingTop: 0,
    },
    formControl: {
        minWidth: '100%',
        paddingTop: 15,
    },
    button: {
        width: '100%',
        marginTop: 50,
    },
});

class VesselForm extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
        onSave: PropTypes.func,
    };

    state = {
        vesselName: '',
        vesselHull: '',
        vesselType: 0,
        length: '',
        width: '',
        lengthError: true,
        widthError: true,
        buildYear: new Date(),
        types: null,
    };

    regEx = new RegExp('^[0-9]+([,.][0-9]+)?$');

    componentDidMount() {
        axios.get('http://localhost:8080/vesselTypes')
            .then((response) => {
                this.setState({
                    types: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getTypes = () => {
        const { classes } = this.props;
        let items = null;
        if (this.state.types !== null) {
            items = this.state.types.map((item) =>
                <MenuItem
                    className={classes.item}
                    key={item.id}
                    value={item.id}
                >
                    {item.type}
                </MenuItem>
            );
        }
        return items;
    };

    handleNameChange = (event) => {
        this.setState({
            vesselName: event.target.value,
        });
    };

    handleHullChange = (event) => {
        this.setState({
            vesselHull: event.target.value,
        });
    };

    handleChangeType = (event) => {
        this.setState({
            vesselType: event.target.value,
        });
    };

    handleChangeLength = (event) => {
        const length = event.target.value;
        this.setState({
            length: length,
            lengthError: !this.regEx.test(length),
        });
    };

    handleChangeWidth = (event) => {
        const width = event.target.value;
        this.setState({
            width: width,
            widthError: !this.regEx.test(width),
        });
    };

    handleChangeDate = (date) => {
        this.setState({
            buildYear: date,
        });
    };

    handleSave = () => {
        if (this.props.onSave) {
            this.props.onSave(this.state.vesselName, this.state.vesselHull, this.state.vesselType, this.state.buildYear, this.state.length, this.state.width);
        }
    };

    render () {
        const { classes } = this.props;
        return (
            <MuiPickersUtilsProvider utils={MomenUtils}>
                <Paper
                    className={classes.paper}
                    elevation={2}
                >
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <TextField
                                className={classes.textField}
                                id="name"
                                label="Vessel Name"
                                value={this.state.vesselName}
                                onChange={this.handleNameChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                className={classes.textField}
                                id="hull"
                                label="Vessel Hull"
                                value={this.state.vesselHull}
                                onChange={this.handleHullChange}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl}>
                                <Select
                                    value={this.state.vesselType}
                                    onChange={this.handleChangeType}
                                    input={<Input id="vessel-type" />}
                                >
                                    <MenuItem className={classes.item} value={0}><em>Type</em></MenuItem>
                                    {this.getTypes()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <DatePicker
                                id="date"
                                label="Build Date"
                                className={classes.textField}
                                value={this.state.buildYear}
                                onChange={this.handleChangeDate}
                                animateYearScrolling={true}
                                format="MMMM Do YYYY"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} error={this.state.lengthError} required={true}>
                                <InputLabel htmlFor="length">Length</InputLabel>
                                <Input
                                    id="length"
                                    placeholder="Vessel length"
                                    value={this.state.length}
                                    onChange={this.handleChangeLength}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl className={classes.formControl} error={this.state.widthError} required={true}>
                                <InputLabel htmlFor="width">Width</InputLabel>
                                <Input
                                    id="length"
                                    placeholder="Vessel width"
                                    value={this.state.width}
                                    onChange={this.handleChangeWidth}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={32}>
                        <Grid item xs={12}>
                            <Button
                                onClick={this.handleSave}
                                color="primary"
                                variant='contained'
                                className={classes.button}
                                disabled={this.state.disableConfirm}
                            >
                                Save Information
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withStyles(styles)(VesselForm);