import React from 'react';
import {
  asset,
  Text,
  View,
} from 'react-vr';
import { constants } from '../../constants';
import { globalViewStyle } from '../../styles'


class TextPanel extends React.Component {
  constructor(props) {
    super(props)
    this.props = props;
  }

  render() {
    let per = 50
    return (
      <View style={globalViewStyle}>
        {/* This is noteworthy.  Having the onEnter and onExit on a wrapping element caused the raycaster to disappear from sections of the 360 sphere */}
        <Text
          onEnter={() => {this.props.panelEnter(this.props.id, this.props.step)}}
          onExit={() => {this.props.panelExit(this.props.id, this.props.step)}}
          style={{
            color: this.props.panel.color,
            backgroundColor: constants.black,
            opacity: this.props.panel.opacity,
            fontSize: 0.2,
            fontWeight: '400',
            layoutOrigin: [0.5, this.props.panel.height],
            paddingLeft: 0.2,
            paddingRight: 0.2,
            textAlign: 'center',
            textAlignVertical: 'center',
            borderColor: constants.rsyellow,
            borderWidth: 0.1,
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
          }}>
          {this.props.panel.text}
        </Text>
      </View>
    );
  }
};

export default TextPanel;
