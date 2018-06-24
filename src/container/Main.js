import React from 'react';
import PropTypes from 'prop-types';

import { tabIds } from '../config';
import Header from '../container/Header';
import NavBar from '../container/NavBar';

import TableCustom from '../assets/components/TableCustom/TableCustom';
import ThrusterDialog from '../assets/components/ThrusterDialog/ThrusterDialog';
import MessageDialog from '../assets/components/MessageDialog/MessageDialog';

import Konva from 'konva';
import { Stage, Layer, Text, Ring, RegularPolygon, Rect, Line, Group } from 'react-konva';
import { Map, TileLayer, Marker, Popup, LayersControl, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

import WindJSLeaflet from 'wind-js-leaflet';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import { colors, theme } from "../config";
import VesselForm from "../assets/components/VesselForm/VesselForm";

import axios from 'axios';

const drawerWidth = 200;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    rootStepper: {
        width: '85%',
        padding: '0',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
    map: {
        width: '100%',
        height: '90%',
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    stepperButton: {
        backgroundColor: colors.MAIN,
    },
});

function getSteps() {
    return ['Start', 'Build', 'Configure', 'Approve'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'Fill The vessel information and press the Next button to begin building the vessel';
        case 1:
            return 'Drag the anchor points to draw the vessel. Press the Next button when finished';
        case 2:
            return 'Add thrusters to the vessel. Double click on each in order to scale or rotate, right click to configure them.  Press the Next button when finished';
        case 3:
            return 'All Done ? Press the Finish button';
        default:
            return 'Uknown stepIndex';
    }
}

class Main extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.layerControlRef = React.createRef();

        this.state = {
            activeTab: 0,
            tabTitle: '',
            activeStep: 0,
            showThrusterDialog: null,
            messageDialog: null,
            vessel: [],
            vesselId: 1,
        };
    }

    tween = null;
    bow = null;
    stern = null;
    port = null;
    sb = null;
    vesselArrayPoints = [];

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('active build step: ' + this.state.activeStep);
        if (this.state.activeTab === tabIds.HOME) {
            axios.get('http://localhost:8080/vessels/' + this.state.vesselId + '/thrusters')
                .then((response) => {
                    this.drawVessel(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            return;
        }

        if (this.state.activeTab === tabIds.BUILD) {
            const anchorLayer = this.refs.anchorLayer;
            const elementsLayer = this.refs.elementsLayer;
            const lineLayer = this.refs.lineLayer;
            if (this.state.activeStep ===1) {
                if (anchorLayer !== null) {
                    anchorLayer.visible(true);
                    elementsLayer.visible(false);
                }
            } else if (this.state.activeStep === 2) {
                if (anchorLayer !== null && elementsLayer !== null) {
                    anchorLayer.visible(false);
                    elementsLayer.visible(true);
                    this.saveVesselPoints(anchorLayer.children);
                }

            } else if (this.state.activeStep === 3) {
                lineLayer.visible(true);
                elementsLayer.visible(false);
                // children 0-3 are the line that draw the vessel. the rest are added thrusters
            }
        }
        if (this.state.activeTab === tabIds.MAPS) {
            const map = this.refs.leafletMap.leafletElement;
            const layerControl = this.layerControlRef.current;
            if (map !== null && layerControl !== null) {
                this.handleShowWind(map, layerControl);
            }
        }
    }

    saveVesselPoints = (points) => {
        this.vesselArrayPoints = [];
        points.forEach((point) => {
            this.vesselArrayPoints.push(point.getAttr('x'), point.getAttr('y'));
        });
        axios.put('http://localhost:8080/vessels/' + this.state.vesselId, {
            stageAnchorPoints: JSON.stringify(this.vesselArrayPoints),
        });
            // .then((response) => {
            //     this.setState({
            //         messageDialog: (
            //             <MessageDialog
            //                 variant="success"
            //                 message={"Vessel was updated successfully"}
            //                 onClose={this.handleMessageDialogClose}
            //             />
            //         ),
            //     });
            // })
            // .catch((error) => {
            //     this.setState({
            //         messageDialog: (
            //             <MessageDialog
            //                 variant="error"
            //                 message={"Data was not saved !!!!"}
            //                 onClose={this.handleMessageDialogClose}
            //             />
            //         ),
            //     });
            // });
    }

    handleWindServerError = (err) => {
        console.log('handle wind server error...');
        console.log(err);
    };

    handleThrusterDialog = (clone) => {
        this.setState({
            showThrusterDialog: (
                <ThrusterDialog
                    thrusterNode={clone}
                    onClose={this.handleCloseThrusterDialog}
                    onConfirm={this.handleConfirmThrusterDialog}
                    onDelete={this.handleThrusterDelete}
                />
            ),
        });
    };

    handleCloseThrusterDialog = () => {
        this.setState({
            showThrusterDialog: null,
        });
    };

    handleConfirmThrusterDialog = (node, type, number, position, effect) => {
        axios.post('http://localhost:8080/vessels/' + this.state.vesselId + '/thrusters', {
            number: number,
            type: type,
            x_cg: position.x,
            y_cg: position.y,
            effect: effect,
            stageNode: JSON.stringify(node.toJSON()),
        })
            .then((response) => {
                this.setState({
                    messageDialog: (
                        <MessageDialog
                            variant="success"
                            message={"Thruster successfully saved and added to vessel/database"}
                            onClose={this.handleMessageDialogClose}
                        />
                    ),
                });
            })
            .catch((error) => {
                this.setState({
                    messageDialog: (
                        <MessageDialog
                            variant="error"
                            message={"Thruster was not saved !!!!"}
                            onClose={this.handleMessageDialogClose}
                        />
                    ),
                });
            });

        this.setState({
            showThrusterDialog: null,
        });
    };

    handleThrusterDelete = (thruster) => {
        thruster.destroy();
        this.refs.lineLayer.draw();
        this.setState({
            showThrusterDialog: null,
        },() => {
            this.setState({
                messageDialog: (
                    <MessageDialog
                        variant="success"
                        message={"Thruster Deleted from stage"}
                        onClose={this.handleMessageDialogClose}
                    />
                ),
            });
        })
    };

    handleMessageDialogClose = () => {
        this.setState({
            messageDialog: null,
        });
    };

    handleShowWind = (mapRef, layerControlRef) => {
        WindJSLeaflet.init({
            localMode: false,
            map: mapRef,
            layerControl: layerControlRef,
            useNearest: false,
            timeISO: null,
            nearestDaysLimit: 7,
            displayValues: true,
            displayOptions: {
                displayPosition: 'bottomleft',
                displayEmptyString: 'No wind data'
            },
            overlayName: 'Wind forecast',

            pingUrl: 'http://localhost:7000/alive',
            latestUrl: 'http://localhost:7000/latest',
            nearestUrl: 'http://localhost:7000/nearest',
            errorCallback: this.handleWindServerError
        });
    };

    handleStepperNext = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1,
        }, () => {
            if (this.state.activeStep === 1) {
                this.bow = {
                    start: this.buildAnchor(40, 40),
                    control1: this.buildAnchor(100, 20),
                    control2: this.buildAnchor(350, 20),
                    end: this.buildAnchor(480, 80)
                };
                this.sb = {
                    start: this.buildAnchor(600, 100),
                    control: this.buildAnchor(550, 200),
                    end: this.buildAnchor(600, 300)
                };
                this.stern = {
                    end: this.buildAnchor(480, 250),
                    control2: this.buildAnchor(350, 300),
                    control1: this.buildAnchor(190, 270),
                    start: this.buildAnchor(140, 300)
                };
                this.port = {
                    end: this.buildAnchor(80, 300),
                    control: this.buildAnchor(20, 200),
                    start: this.buildAnchor(40, 100)
                };

                this.drawCurves();
                this.updateDottedLines();
            }
        });
    };

    handleStepperBack = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep - 1,
        }, () => {
            if (this.state.activeStep === 1) {
                this.drawCurves();
            }
        });
    };

    handleStepperReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    buildAnchor = (x, y) => {
        const anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 10,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            draggable: true
        });

        const anchorLayer = this.refs.anchorLayer;

        // add hover styling
        anchor.on('mouseover', function() {
            document.body.style.cursor = 'pointer';
            this.setStrokeWidth(3);
            anchorLayer.draw();
        });
        anchor.on('mouseout', function() {
            document.body.style.cursor = 'default';
            this.setStrokeWidth(2);
            anchorLayer.draw();

        });

        anchor.on('dragend', () => {
            this.drawCurves();
            this.updateDottedLines();
        });

        anchorLayer.add(anchor);
        return anchor;
    };

    drawCurves = () => {
        if (this.state.activeStep === 1) {
            const curveLayer = this.refs.curveLayer;
            const context = curveLayer.getContext();
            context.clear();
            // draw bow
            context.beginPath();
            context.moveTo(this.bow.start.attrs.x, this.bow.start.attrs.y);
            context.bezierCurveTo(
                this.bow.control1.attrs.x,
                this.bow.control1.attrs.y,
                this.bow.control2.attrs.x,
                this.bow.control2.attrs.y,
                this.bow.end.attrs.x,
                this.bow.end.attrs.y
            );
            context.setAttr('strokeStyle', 'black');
            context.setAttr('lineWidth', 4);
            context.stroke();

            // draw startboard
            context.beginPath();
            context.moveTo(this.sb.start.attrs.x, this.sb.start.attrs.y);
            context.quadraticCurveTo(this.sb.control.attrs.x, this.sb.control.attrs.y, this.sb.end.attrs.x, this.sb.end.attrs.y);
            context.setAttr('strokeStyle', 'green');
            context.setAttr('lineWidth', 4);
            context.stroke();

            // draw stern
            context.beginPath();
            context.moveTo(this.stern.end.attrs.x, this.stern.end.attrs.y);
            context.bezierCurveTo(
                this.stern.control2.attrs.x,
                this.stern.control2.attrs.y,
                this.stern.control1.attrs.x,
                this.stern.control1.attrs.y,
                this.stern.start.attrs.x,
                this.stern.start.attrs.y
            );
            context.setAttr('strokeStyle', 'black');
            context.setAttr('lineWidth', 4);
            context.stroke();

            // draw port
            context.beginPath();
            context.moveTo(this.port.end.attrs.x, this.port.end.attrs.y);
            context.quadraticCurveTo(this.port.control.attrs.x, this.port.control.attrs.y, this.port.start.attrs.x, this.port.start.attrs.y);
            context.setAttr('strokeStyle', 'red');
            context.setAttr('lineWidth', 4);
            context.stroke();

        }
    };

    updateDottedLines = () => {
        if (this.state.activeStep === 1) {
            const a = this.stern;
            const b = this.bow;
            const p = this.port;
            const sb = this.sb;
            const lineLayer = this.refs.lineLayer;
            const bowLine = lineLayer.get('#bowLine')[0];
            const sternLine = lineLayer.get('#sternLine')[0];
            const portLine = lineLayer.get('#portLine')[0];
            const sbLine = lineLayer.get('#sbLine')[0];

            bowLine.setPoints([b.start.attrs.x, b.start.attrs.y, b.control1.attrs.x, b.control1.attrs.y, b.control2.attrs.x, b.control2.attrs.y, b.end.attrs.x, b.end.attrs.y]);
            sbLine.setPoints([sb.start.attrs.x, sb.start.attrs.y, sb.control.attrs.x, sb.control.attrs.y, sb.end.attrs.x, sb.end.attrs.y]);
            sternLine.setPoints([a.end.attrs.x, a.end.attrs.y, a.control2.attrs.x, a.control2.attrs.y, a.control1.attrs.x, a.control1.attrs.y, a.start.attrs.x, a.start.attrs.y]);
            portLine.setPoints([p.end.attrs.x, p.end.attrs.y, p.control.attrs.x, p.control.attrs.y, p.start.attrs.x, p.start.attrs.y]);

            lineLayer.draw();
        }
    };

    handleAnchorDrag = () => {
        const anchorLayer = this.refs.anchorLayer;
        anchorLayer.on('beforeDraw', () => {
            this.drawCurves();
            this.updateDottedLines();
        });
    };

    handleSaveVesselInformation = (name, hull, type, date, length, width) => {
        axios.post("http://localhost:8080/vessels", {
            name: name,
            hull: hull,
            type: type,
            date: date,
            length: length,
            width: width,
        })
            .then((response) => {
                this.setState({
                    vesselId: response.data.id,
                    messageDialog: (
                        <MessageDialog
                            variant="success"
                            message={response.data.name + " was save successfully to database with id " + response.data.id}
                            onClose={this.handleMessageDialogClose}
                        />
                    ),
                });
            })
            .catch((error) => {
                this.setState({
                    messageDialog: (
                        <MessageDialog
                            variant="error"
                            message={"Vessel was not saved !!!!"}
                            onClose={this.handleMessageDialogClose}
                        />
                    ),
                });
            });
    };

    renderBuildProcess = () => {
        switch (this.state.activeStep) {
            case 0:
                return (
                    <VesselForm
                        onSave={this.handleSaveVesselInformation}
                    />
                );
            case 1:
            case 2:
            case 3:
                return (
                    <Stage
                        width={window.innerWidth}
                        height={window.innerHeight - 250}
                    >
                        <Layer ref="curveLayer">
                        </Layer>
                        <Layer ref="anchorLayer"
                               onDragStart={this.handleAnchorDrag}
                        >
                        </Layer>
                        <Layer
                            ref="lineLayer"
                            onClick={this.handleMainLayerClick}
                        >
                            <Line
                                dash={[10, 10, 0, 10]}
                                strokeWidth={3}
                                stroke={'blue'}
                                lineCap={'round'}
                                id="bowLine"
                                opacity={0.3}
                                points={[0,0]}
                            />
                            <Line
                                dash={[10, 10, 0, 10]}
                                strokeWidth={3}
                                stroke={'blue'}
                                lineCap={'round'}
                                id="sternLine"
                                opacity={0.3}
                                points={[0,0]}
                            />
                            <Line
                                dash={[10, 10, 0, 10]}
                                strokeWidth={3}
                                stroke={'blue'}
                                lineCap={'round'}
                                id="portLine"
                                opacity={0.3}
                                points={[0,0]}
                            />
                            <Line
                                dash={[10, 10, 0, 10]}
                                strokeWidth={3}
                                stroke={'blue'}
                                lineCap={'round'}
                                id="sbLine"
                                opacity={0.3}
                                points={[0,0]}
                            />
                        </Layer>
                        <Layer
                            ref="elementsLayer"
                            width={100}
                            height={window.innerHeight - 250}
                            x={650}
                            y={0}
                            // visible={false}
                        >
                            <Text
                                x={50}
                                y={15}
                                text="THRUSTERS:"
                                fontSize={20}
                            />
                            <Group
                                ref="azimuth"
                                onMouseDown={this.handleCloneThruster}
                                onClick={this.handleThrusterDialog}
                                draggable={true}
                                rotation={0}
                                x={110}
                                y={100}
                                opacity={0.8}
                                shadowOpacity={0.6}
                                shadowColor={'black'}
                                shadowBlur={10}
                                shadowOffset={{
                                    x: 5,
                                    y: 5,
                                }}
                                scale={{
                                    x: 1,
                                    y: 1,
                                }}
                                startScale={1}
                            >
                                <Ring
                                    innerRadius={40}
                                    outerRadius={55}
                                    stroke={'black'}
                                    strokeWidth={1.2}
                                    opacity={0.8}
                                    shadowOpacity={0.6}
                                    shadowColor={'black'}
                                    shadowBlur={10}
                                    shadowOffset={{
                                        x: 5,
                                        y: 5,
                                    }}
                                    scale={{
                                        x: 1,
                                        y: 1,
                                    }}
                                    startScale={1}
                                    dash={[10, 5]}
                                />
                                <Rect
                                    x={-7}
                                    y={-37}
                                    width={14}
                                    height={74}
                                    cornerRadius={3}
                                    stroke={'black'}
                                    strokeWidth={1.2}
                                    opacity={0.8}
                                    shadowOpacity={0.6}
                                    shadowColor={'black'}
                                    shadowBlur={10}
                                    shadowOffset={{
                                        x: 5,
                                        y: 5,
                                    }}
                                    scale={{
                                        x: 1,
                                        y: 1,
                                    }}
                                    startScale={1}
                                    dash={[10, 5]}
                                />
                                <RegularPolygon
                                    x={0}
                                    y={-45}
                                    sides={3}
                                    radius={6.5}
                                    stroke={'black'}
                                    strokeWidth={1}
                                    opacity={0.8}
                                    shadowOpacity={0.6}
                                    shadowColor={'black'}
                                    shadowBlur={10}
                                    shadowOffset={{
                                        x: 5,
                                        y: 5,
                                    }}
                                    scale={{
                                        x: 1,
                                        y: 1,
                                    }}
                                    startScale={1}
                                    dash={[10, 5]}
                                />
                            </Group>
                            <Rect
                                onMouseDown={this.handleCloneThruster}
                                draggable={true}
                                x={150}
                                y={180}
                                rotation={90}
                                width={14}
                                height={85}
                                cornerRadius={3}
                                stroke={'black'}
                                strokeWidth={1.2}
                                opacity={0.8}
                                shadowOpacity={0.6}
                                shadowColor={'black'}
                                shadowBlur={10}
                                shadowOffset={{
                                    x: 5,
                                    y: 5,
                                }}
                                scale={{
                                    x: 1,
                                    y: 1,
                                }}
                                startScale={1}
                                dash={[10, 5]}
                            />
                        </Layer>
                    </Stage>
                );
        }
    };

    handleTabChange = (tabId) => {
        this.setState({
            activeTab: tabId,
        }, () => {
            switch (tabId) {
                case tabIds.ALARMS:
                    this.setState({
                        tabTitle: 'Alarms and Notifications',
                    });
                    break;
                case tabIds.MAPS:
                    this.setState({
                        tabTitle: 'Navigation',
                    });
                    break;
                case tabIds.HOME:
                    this.setState({
                        tabTitle: 'Joystick Control',
                    });
                    break;
                case tabIds.BUILD:
                    this.setState({
                        tabTitle: 'Configure Vessel',
                    });
                    break;
            }
        });
    };

    handleCloneThruster = (event) => {
        let shape = null;
        if (event.target.className === 'Rect'){
            shape = event.target;
        } else {
            shape = this.refs.azimuth;
        }

        shape.stopDrag();
        const clone = shape.clone({
            x : shape.getAttr('x'),
            y : shape.getAttr('y'),
        });
        // events will also be cloned so we need to disable dragstart
        clone.off('dragstart');

        const elementsLayer = this.refs.elementsLayer;

        // then add to layer and start dragging new shape
        elementsLayer.add(clone);
        clone.startDrag();

        clone.on('dragstart', () => {
            this.handleCloneStartDrag(clone);
        });
        clone.on('dragend', () => {
            this.handleCloneDragEnd(clone)
        });
        clone.on('mousedown', (event) => {
            if (event.evt.which === 3) {
                event.evt.preventDefault();
                this.handleThrusterDialog(clone);
            }
        });
        clone.on('dblclick', () => {
            this.handleCloneTransformation(clone);
        });
    };

    handleCloneStartDrag = (clone) => {
        const lineLayer = this.refs.lineLayer;
        clone.moveTo(lineLayer);
        if (this.tween) {
            this.tween.pause();
        }
        clone.setAttrs({
            shadowOffset: {
                x: 8,
                y: 8,
            },
            scale: {
                x: clone.getAttr('startScale') * 1.05,
                y: clone.getAttr('startScale') * 1.05,
            },
            startScale: clone.getAttr('scaleY'),
        });
    };

    handleCloneDragEnd = (clone) => {
        this.tween = new Konva.Tween({
            node: clone,
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: clone.getAttr('startScale'),
            scaleY: clone.getAttr('startScale'),
            shadowOffsetX: 5,
            shadowOffsetY: 5,
        });
        this.tween.play();
        // removing dash stroke from clone
        if (clone.nodeType === 'Group') {
            for (let i= 0; i < clone.children.length; i++) {
                clone.children[i].dash([0,0]);
            }
        } else {
            clone.dash([0,0]);
        }
    };

    handleCloneTransformation = (clone) => {
        const transformer = new Konva.Transformer();
        const lineLayer = this.refs.lineLayer;
        lineLayer.add(transformer);
        transformer.attachTo(clone);
        lineLayer.draw();
    };

    handleMainLayerClick = (event) => {
        // if click on empty area - remove all transformers
        const lineLayer = this.refs.lineLayer;
        lineLayer.find('Transformer').destroy();
        lineLayer.draw();
    };

    drawVessel = (data) => {
        this.vesselArrayPoints = JSON.parse(data[0].vessel.stageAnchorPoints);
        const mainLayer = this.refs.mainLayer;
        // const context = mainLayer.getContext();
        // context.clear();
        // // draw bow
        // context.beginPath();
        // context.moveTo(this.vesselArrayPoints[0], this.vesselArrayPoints[1]);
        // context.bezierCurveTo(
        //     this.vesselArrayPoints[2],
        //     this.vesselArrayPoints[3],
        //     this.vesselArrayPoints[4],
        //     this.vesselArrayPoints[5],
        //     this.vesselArrayPoints[6],
        //     this.vesselArrayPoints[7],
        // );
        // context.setAttr('strokeStyle', 'black');
        // context.setAttr('lineWidth', 4);
        // context.stroke();
        //
        // // draw startboard
        // context.beginPath();
        // context.moveTo(this.vesselArrayPoints[8], this.vesselArrayPoints[9]);
        // context.quadraticCurveTo(this.vesselArrayPoints[10], this.vesselArrayPoints[11], this.vesselArrayPoints[12], this.vesselArrayPoints[13]);
        // context.setAttr('strokeStyle', 'black');
        // context.setAttr('lineWidth', 4);
        // context.stroke();
        //
        // // draw stern
        // context.beginPath();
        // context.moveTo(this.vesselArrayPoints[14], this.vesselArrayPoints[15]);
        // context.bezierCurveTo(
        //     this.vesselArrayPoints[16],
        //     this.vesselArrayPoints[17],
        //     this.vesselArrayPoints[18],
        //     this.vesselArrayPoints[19],
        //     this.vesselArrayPoints[20],
        //     this.vesselArrayPoints[21],
        // );
        // context.setAttr('strokeStyle', 'black');
        // context.setAttr('lineWidth', 4);
        // context.stroke();
        //
        // // draw port
        // context.beginPath();
        // context.moveTo(this.vesselArrayPoints[22], this.vesselArrayPoints[23]);
        // context.quadraticCurveTo(this.vesselArrayPoints[24], this.vesselArrayPoints[25], this.vesselArrayPoints[26], this.vesselArrayPoints[27]);
        // context.setAttr('strokeStyle', 'black');
        // context.setAttr('lineWidth', 4);
        // context.stroke();

        const boat = new Konva.Line({
            points: this.vesselArrayPoints,
            fill: '#bab9a5',
            stroke: 'black',
            strokeWidth: 3,
            closed : true,
            // bezier: true,
            tension : 0.3
        });

        mainLayer.add(boat);

        //draw thrusters on vessel
        data.forEach((thruster) => {
            const node = Konva.Node.create(JSON.parse(thruster.stageNode));
            node.setAttrs({
                draggable: false,
            });
            mainLayer.add(node);
        });

        mainLayer.draw();
    };

    getActiveTab = () => {
        const tabId = this.state.activeTab;
        const {classes} = this.props;
        switch (tabId) {
            case tabIds.HOME: {
                return (
                    <Stage
                        ref="stage"
                        width={window.innerWidth}
                        height={window.innerHeight - 128}
                    >
                        <Layer
                            ref="mainLayer"
                        >
                            {/*<Boat*/}
                                {/*ref="mainVessel"*/}
                                {/*onVesselClick={this.handleMainLayerClick}*/}
                            {/*/>*/}
                        </Layer>
                    </Stage>
                );
            }
            case tabIds.MAPS: {
                const position = [67.296517, 15.164172];
                const {BaseLayer, Overlay} = LayersControl;
                return (
                    <Map ref="leafletMap" className={classes.map} center={position} zoom={10}>
                        <LayersControl ref={this.layerControlRef} position="topright">
                            <BaseLayer checked name="Satellite">
                                <TileLayer
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            </BaseLayer>
                            <BaseLayer name="Day Light">
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </BaseLayer>
                            <BaseLayer name="Night Light">
                                <TileLayer
                                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
                                />
                            </BaseLayer>
                            <Overlay checked name="Ocean markups">
                                <TileLayer
                                    url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                                />
                            </Overlay>
                            <Overlay checked name="Markers">
                                <Marker position={position}>
                                    <Popup>
                                        <span>
                                          Ægir Dynamics <br/> HQ.
                                        </span>
                                    </Popup>
                                </Marker>
                            </Overlay>
                        </LayersControl>
                        <FeatureGroup>
                            <EditControl
                                position='topleft'
                                draw={{
                                    rectangle: false,
                                    circlemarker: false,
                                    polygon: false,
                                }}
                            />
                        </FeatureGroup>
                    </Map>
                );
            }
            case tabIds.ALARMS: {
                return (
                    <TableCustom
                        tableTitle="Alarms and Notifications"
                    />
                );
            }
            case tabIds.BUILD: {
                const { classes } = this.props;
                const steps = getSteps();
                const { activeStep } = this.state;

                return (
                    <div>
                        <Stepper className={classes.rootStepper} activeStep={activeStep} alternativeLabel>
                            {steps.map(label => {
                                return (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {this.renderBuildProcess()}
                        <div>
                            {this.state.activeStep === steps.length ? (
                                <div>
                                    <Typography className={classes.instructions}>
                                        All steps completed - you&quot;re finished
                                    </Typography>
                                    <Button onClick={this.handleStepperReset}>Reset</Button>
                                </div>
                            ) : (
                                <div>
                                    <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                    <div>
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={this.handleStepperBack}
                                            className={classes.backButton}
                                        >
                                            Back
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={this.handleStepperNext}>
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <Header
                        title={this.state.tabTitle}
                    />
                    <NavBar
                        onTabChange={this.handleTabChange}
                    />
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {this.getActiveTab()}
                    </main>
                    {this.state.showThrusterDialog}
                    {this.state.messageDialog}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(Main);
