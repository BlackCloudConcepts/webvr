import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
  NativeModules,
} from 'react-vr';
import World from './src/components/world/world';
import { globalViewStyle } from './src/styles'


export default class react_vr_game extends React.Component {
  constructor () {
    super()
  }

  componentDidMount() {
    setTimeout(()=>{this.move(0,0,0)},1000)
  }

  move(x,y,z) {
    NativeModules.TeleportModule.teleportCamera(x, y, z);
  }

  render() {
    return (
      <View style={globalViewStyle}>
        <Pano source={asset('backgrounds/vr-background-2.png')}/>
        <World move={this.move}></World>
      </View>
    );
  }
};

AppRegistry.registerComponent('react_vr_game', () => react_vr_game);
