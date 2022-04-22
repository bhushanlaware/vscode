import * as React from 'react';

import {
  CORNER_RESIZER_SIZE,
  DEVICES,
  DEVICE_TO_DIMENSIONS,
  DEVICE_TO_NAME,
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
  RESIZER_LENGTH,
  RESIZER_THICKNESS,
} from './constants';
import { clampHeight, clampWidth } from './utils';

type ResizeProps = {
  isResponsiveEnabled: boolean;
  children: React.ReactElement;
  rootStyles?: React.CSSProperties;
};

type axisTypes = 'x' | 'y' | 'xy';

type ResizeState = {
  height: number;
  width: number;
  selectedDevice: DEVICES;
  scale: number;
  isResizing: boolean;
  axis?: axisTypes;
  original?: {
    height: number;
    width: number;
    scale: number;
    x: number;
    y: number;
  };
};

export class Resize extends React.PureComponent<ResizeProps, ResizeState> {
  handleChangeHeight: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeWidth: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMouseDownX: (e: React.MouseEvent) => void;
  handleMouseDownY: (e: React.MouseEvent) => void;
  handleMouseDownXy: (e: React.MouseEvent) => void;

  resizeObserverInst: ResizeObserver;

  contentRef: React.RefObject<HTMLDivElement>;
  rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: ResizeProps) {
    super(props);
    this.state = {
      height: DEVICE_TO_DIMENSIONS[DEVICES.HD].h,
      width: DEVICE_TO_DIMENSIONS[DEVICES.HD].w,
      selectedDevice: DEVICES.HD,
      scale: 1,
      isResizing: false,
    };

    this.contentRef = React.createRef();
    this.rootRef = React.createRef();

    this.handleChangeHeight = this.handleDimensionsChange.bind(this, 'height');
    this.handleChangeWidth = this.handleDimensionsChange.bind(this, 'width');
    this.handleMouseDownX = this.handleMouseDown.bind(this, 'x');
    this.handleMouseDownY = this.handleMouseDown.bind(this, 'y');
    this.handleMouseDownXy = this.handleMouseDown.bind(this, 'xy');

    this.resizeObserverInst = new ResizeObserver(this.handleResize.bind(this));
  }

  componentDidMount() {
    if (this.props.isResponsiveEnabled) {
      this.resizeObserverInst.observe(this.rootRef.current!);
    }
  }

  componentWillUnmount() {
    if (this.props.isResponsiveEnabled) {
      this.resizeObserverInst.unobserve(this.rootRef.current!);
    }
  }

  componentDidUpdate(prevProps: ResizeProps) {
    if (this.props.isResponsiveEnabled !== prevProps.isResponsiveEnabled) {
      if (this.props.isResponsiveEnabled) {
        this.resizeObserverInst.observe(this.rootRef.current!);
      } else {
        this.resizeObserverInst.unobserve(this.rootRef.current!);
      }
    }
  }

  bindEvents = (): void => {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
  };

  unbindEvents = (): void => {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  };

  handleMouseDown(axis: axisTypes, e: React.MouseEvent): void {
    this.setState(
      {
        original: {
          height: this.state.height,
          width: this.state.width,
          scale: this.state.scale,
          x: e.clientX,
          y: e.clientY,
        },
        isResizing: true,
        axis,
      },
      this.bindEvents
    );
  }

  handleMouseUp = (e: MouseEvent): void => {
    this.setState(
      {
        isResizing: false,
        scale: this.getScale(this.state.height, this.state.width),
      },
      this.unbindEvents
    );
  };

  handleMouseMove = (e: MouseEvent): void => {
    const { isResizing, original, axis, scale } = this.state;

    if (!this.contentRef.current || !isResizing || !original) return;

    const { clientWidth, clientHeight } = this.contentRef.current;
    let actualHeight = clientHeight - PADDING_VERTICAL;
    let actualWidth = clientWidth - PADDING_HORIZONTAL;
    let scaleInv = 1 / scale;
    actualHeight = actualHeight * scaleInv;
    actualWidth = actualWidth * scaleInv;
    const newWidth = Math.round(
      clampWidth(Math.min(actualWidth, original.width + 2 * scaleInv * (e.clientX - original.x)))
    );
    const newHeight = Math.round(
      clampHeight(Math.min(actualHeight, original.height + scaleInv * (e.clientY - original.y)))
    );

    if (this.state.selectedDevice !== DEVICES.CUSTOM) {
      this.setState({ selectedDevice: DEVICES.CUSTOM });
    }

    if (axis === 'x') {
      this.setState({
        width: newWidth,
      });
    } else if (axis === 'y') {
      this.setState({
        height: newHeight,
      });
    } else {
      this.setState({
        height: newHeight,
        width: newWidth,
      });
    }
  };

  handleResize = (): void => {
    const scale: number = this.getScale(this.state.height, this.state.width);
    this.setState({ scale });
  };

  handleDimensionsChange(
    field: 'height' | 'width',
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const value = event.target.value;
    let newState: ResizeState = { ...this.state };
    newState[field] = parseInt(value);
    if (newState.selectedDevice !== DEVICES.CUSTOM) {
      newState.selectedDevice = DEVICES.CUSTOM;
    }
    newState.width = clampWidth(newState.width);
    newState.height = clampHeight(newState.height);
    newState.scale = this.getScale(newState.height, newState.width);
    this.setState(newState);
  }

  handleDeviceChange = (
    event: React.ChangeEvent<HTMLSelectElement> & {
      target: {
        value: DEVICES;
      };
    }
  ): void => {
    const value = event.target.value;
    let newState: ResizeState = { ...this.state };
    if (value === DEVICES.CUSTOM) {
      newState.selectedDevice = value;
    } else {
      newState.height = DEVICE_TO_DIMENSIONS[value].h;
      newState.width = DEVICE_TO_DIMENSIONS[value].w;
      newState.selectedDevice = value;
      newState.scale = this.getScale(DEVICE_TO_DIMENSIONS[value].h, DEVICE_TO_DIMENSIONS[value].w);
    }
    this.setState(newState);
  };

  getScale = (height: number, width: number): number => {
    if (this.contentRef.current === null) return 1;

    const { clientWidth, clientHeight } = this.contentRef.current;
    const actualHeight = clientHeight - PADDING_VERTICAL;
    const actualWidth = clientWidth - PADDING_HORIZONTAL;

    // try to extend width to actualWidth
    let scale1 = Math.min(1, actualWidth / width);

    // try to extend height to actualHeight
    let scale2 = Math.min(1, actualHeight / height);

    return Math.min(scale1, scale2);
  };

  renderToolbar = (): React.ReactElement => {
    const { height, width, selectedDevice } = this.state;
    return (
      <>
        <div className="responsive-toolbar-divider" />
        <div className="responsive-toolbar">
          <select
            value={selectedDevice}
            onChange={this.handleDeviceChange}
            className="theia-select"
            title="Devices"
          >
            {Object.values(DEVICES).map((device) => {
              return <option value={device}>{DEVICE_TO_NAME[device]}</option>;
            })}
          </select>
          <input
            type="number"
            value={width}
            title="Width"
            className="theia-input"
            onChange={this.handleChangeWidth}
          />
          <input
            type="number"
            value={height}
            className="theia-input"
            title="Height"
            onChange={this.handleChangeHeight}
          />
        </div>
      </>
    );
  };

  getContentStyles = (): React.CSSProperties => {
    const { height, width, scale, isResizing } = this.state;
    if (!this.props.isResponsiveEnabled) {
      return {
        height: '100%',
        width: '100%',
      };
    } else {
      return {
        userSelect: 'none',
        pointerEvents: isResizing ? 'none' : 'auto',
        height: height + 'px',
        width: width + 'px',
        transform: `scale(${scale})`,
        transformOrigin: 'center top',
        left: `calc(50% - ${(width / 2).toFixed(0)}px)`,
        position: 'absolute',
      };
    }
  };

  getResizerStyles = (): React.CSSProperties => {
    return {
      borderRadius: RESIZER_THICKNESS / 2,
      position: 'absolute',
    };
  };

  getHeightResizerStyles = (): React.CSSProperties => {
    const { height, scale, width } = this.state;
    return {
      ...this.getResizerStyles(),
      width: width * scale,
      maxWidth: RESIZER_LENGTH,
      height: RESIZER_THICKNESS,
      top: `calc(${height * scale}px + 8px)`,
      left: '50%',
      transform: 'translateX(-50%)',
      cursor: 'ns-resize',
    };
  };

  getWidthResizerStyles = (): React.CSSProperties => {
    const { width, height, scale } = this.state;
    return {
      ...this.getResizerStyles(),
      width: RESIZER_THICKNESS,
      height: height * scale,
      maxHeight: RESIZER_LENGTH,
      top: Math.max(0, (height * scale - RESIZER_LENGTH) / 2),
      left: `calc(50% + ${(width * scale) / 2}px + 8px)`,
      cursor: 'ew-resize',
    };
  };

  getCornerResizerStyles = (): React.CSSProperties => {
    const { height, width, scale } = this.state;
    return {
      height: CORNER_RESIZER_SIZE,
      width: CORNER_RESIZER_SIZE,
      background: 'white',
      top: height * scale - CORNER_RESIZER_SIZE,
      left: `calc(50% + ${(width * scale) / 2}px - ${CORNER_RESIZER_SIZE}px)`,
    };
  };

  render() {
    const { isResponsiveEnabled, children, rootStyles = {} } = this.props;
    return (
      <div className="responsive-root" ref={this.rootRef} style={rootStyles}>
        {isResponsiveEnabled && this.renderToolbar()}
        <div className="responsive-content-container" ref={this.contentRef}>
          <div className="responsive-content" style={this.getContentStyles()}>
            {children}
          </div>
          {isResponsiveEnabled && (
            <>
              <div
                className="resizer"
                style={this.getWidthResizerStyles()}
                onMouseDown={this.handleMouseDownX}
              />
              <div
                className="resizer"
                style={this.getHeightResizerStyles()}
                onMouseDown={this.handleMouseDownY}
              />
              <div
                className="corner-resizer-icon"
                style={this.getCornerResizerStyles()}
                onMouseDown={this.handleMouseDownXy}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
