import React from 'react';
import {
  Animated,
  AppRegistry,
  asset,
  Box,
  texture,
  View
} from 'react-vr';
import { constants } from '../../constants';


const AnimatedBox = Animated.createAnimatedComponent(Box);

class BaseBox extends React.Component {
  constructor() {
    super();

    this.state = {
      rotation: new Animated.Value(0),
    };
    this._rotateTo = 360;
  }

  componentDidMount() {
    this._rotateOnce();
  }

  /**
   * Rotate the cube back and forth
   */
  _rotateOnce() {
    this.state.rotation.setValue(0);
    Animated.timing(this.state.rotation, {
      toValue: this._rotateTo,
      duration: 10000,
    }).start(() => this._rotateOnce());
    this._rotateTo = -this._rotateTo;
  }

  render() {
    return (
      <View>
        <AnimatedBox
          onEnter={() => {this.props.panelEnter(this.props.id, this.props.step)}}
          onExit={() => {this.props.panelExit(this.props.id, this.props.step)}}
          style={{
            transform: [
              {
                translate: [
                  this.props.panel.coords.x+this.props.stepbase.coords.x,
                  this.props.panel.coords.y+this.props.stepbase.coords.y,
                  this.props.panel.coords.z+this.props.stepbase.coords.z
                ]
              },
              {rotateY: this.state.rotation}
            ],
            opacity: this.props.panel.opacity,
            color: this.props.panel.color
          }}
          dimWidth={this.props.panel.physicalWidth}
          dimHeight={this.props.panel.physicalHeight}
          dimDepth={this.props.panel.physicalDepth}
          texture={asset('game_objects/'+this.props.id.replace('img_','')+'.jpg')}
        />
      </View>
    );
  }
}

export default BaseBox
