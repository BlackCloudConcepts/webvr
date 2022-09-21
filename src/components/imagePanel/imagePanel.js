import React from 'react';
import {
  asset,
  Image,
  View,
} from 'react-vr';
import { constants } from '../../constants';
import { globalViewStyle } from '../../styles'

class ImagePanel extends React.Component {
  constructor(props) {
    super(props)
    this.props = props;
  }

  render() {
    return (
      <View style={globalViewStyle}>
        {/* This is noteworthy.  Having the onEnter and onExit on a wrapping element caused the raycaster to disappear from sections of the 360 sphere */}
        <Image
          onEnter={() => {this.props.panelEnter(this.props.id, this.props.step)}}
          onExit={() => {this.props.panelExit(this.props.id, this.props.step)}}
          style={{
            height: this.props.panel.physicalHeight,
            width: this.props.panel.physicalWidth,
            layoutOrigin: [0.5, this.props.panel.height],
            opacity: this.props.panel.opacity,
            borderColor: constants.rsblue, // setting the selected state and changing the border width upon selection
            borderWidth: this.props.panel.borderWidth,
            transform: [
              {
                translate: [
                  this.props.panel.coords.x+this.props.stepbase.coords.x,
                  this.props.panel.coords.y+this.props.stepbase.coords.y,
                  this.props.panel.coords.z+this.props.stepbase.coords.z
                ]
              },
              {rotateY: this.props.panel.rotateY}
            ],
          }}
          source={asset('game_objects/'+this.props.id.replace('img_','')+'.jpg')}
        />
      </View>
    );
  }
};

export default ImagePanel;
