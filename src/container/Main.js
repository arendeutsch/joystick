import React from 'react';
import PropTypes from 'prop-types';

import { tabIds } from '../config';
import Header from '../container/Header';
import NavBar from '../container/NavBar';

import Boat from '../assets/components/Boat/Boat'
import TableCustom from '../assets/components/TableCustom/TableCustom';

import Konva from 'konva';
import { Stage, Layer, Text, Ring, RegularPolygon, Rect } from 'react-konva';
import { Map, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';

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
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
    map: {
        width: '100%',
        height: '100%',
    },
});

class Main extends React.Component {

    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            tabTitle: '',
        };
    }

    callToServer = () => {
        console.log('calling to server...');
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
                        tabTitle: 'Map',
                    });
                    break;
                case tabIds.HOME:
                    this.setState({
                        tabTitle: 'Joystick Control',
                    });
                    break;
            }
        });
    };

    handleStageMouseDown = (event) => {
        console.log('mouse down');
        const shape = event.target;
        const elementsLayer = this.refs.elementsLayer;
        // stop dragging original shape
        shape.stopDrag();
        const clone = shape.clone({
            x: shape.getAttr('x'),
            y: shape.getAttr('y'),
        });
        // events will also be cloned
        // so we need to disable dragstart
        clone.off('dragstart');

        // add clone to original layer and start dragging new shape
        elementsLayer.add(clone);
        clone.startDrag(); // ????
    };

    handleStageDragStart = (event) => {
        const shape = event.target;
        console.log('dragging shape');
        if (this.tween) {
            this.tween.pause();
        }
        shape.setAttrs({
            shadowOffset: {
                x: 15,
                y: 15,
            },
            scale: {
                x: shape.getAttr('startScale') * 1.2,
                y: shape.getAttr('startScale') * 1.2,
            }
        });

        const mainLayer = this.refs.mainLayer;
        shape.moveTo(mainLayer);
    };

    handleStageDragEnded = (event) => {
        const shape = event.target;
        console.log('dragging ended');

        this.tween = new Konva.Tween({
            node: shape,
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: shape.getAttr('startScale'),
            scaleY: shape.getAttr('startScale'),
            shadowOffsetX: 5,
            shadowOffsetY: 5,
        });

        this.tween.play();
    };

    getActiveTab = () => {
        const tabId = this.state.activeTab;
        const {classes} = this.props;
        switch (tabId) {
            case tabIds.HOME: {
                const scale = Math.random();
                return (
                    <Stage
                        ref="stage"
                        width={800}
                        height={900}
                    >
                        <Layer
                            ref="elementsLayer"
                            width={200}
                            height={900}
                            x={500}
                            y={0}
                        >
                            <Text
                                x={50}
                                y={15}
                                text="Elements:"
                            />
                            <Ring
                                onMouseDown={this.handleStageMouseDown}
                                onDragStart={this.handleStageDragStart}
                                onDragEnd={this.handleStageDragEnded}
                                x={90}
                                y={125}
                                innerRadius={40}
                                outerRadius={55}
                                stroke={'black'}
                                strokeWidth={1.2}
                                dash={[10, 5]}
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
                                draggable={true}
                            />
                            <Rect
                                onMouseDown={this.handleStageMouseDown}
                                onDragStart={this.handleStageDragStart}
                                onDragEnd={this.handleStageDragEnded}
                                x={90}
                                y={200}
                                width={14}
                                height={74}
                                cornerRadius={3}
                                stroke={'black'}
                                strokeWidth={1.2}
                                dash={[10, 5]}
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
                                draggable={true}
                            />
                            <RegularPolygon
                                onMouseDown={this.handleStageMouseDown}
                                onDragStart={this.handleStageDragStart}
                                onDragEnd={this.handleStageDragEnded}
                                x={90}
                                y={300}
                                sides={3}
                                radius={6.5}
                                fill={'black'}
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
                                draggable={true}
                            />
                         </Layer>
                        <Layer
                            ref="mainLayer"
                        >
                            <Boat/>
                        </Layer>
                    </Stage>
                );
            }
            case tabIds.MAPS: {
                const position = [67.296517, 15.164172];
                const {BaseLayer, Overlay} = LayersControl;
                return (
                    <Map className={classes.map} center={position} zoom={12}>
                        <LayersControl position="topright">
                            <BaseLayer checked name="Day Light">
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
                                          Njord Dynamics <br/> HQ.
                                        </span>
                                    </Popup>
                                </Marker>
                            </Overlay>
                        </LayersControl>
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
        }
    };

    render() {
        const { classes } = this.props;

        return (
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
            </div>
        );
    }
}

export default withStyles(styles)(Main);
