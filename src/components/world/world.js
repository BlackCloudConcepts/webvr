import React from 'react';
import {
  asset,
  Text,
  View,
  VrButton,
  Cylinder
} from 'react-vr';
import TextPanel from '../textPanel/textPanel'
import ImagePanel from '../imagePanel/imagePanel'
import BaseBox from '../baseBox/baseBox'
// import layoutData from '../../data/layoutData.json'
import objectData from '../../data/objectData.json'
import positionData from '../../data/positionData.json'
import gamesetupData from '../../data/gamesetupData.json'
import { constants } from '../../constants';
import { globalViewStyle } from '../../styles'


class World extends React.Component {
  constructor(props) {
    super(props)
    this.props = props;
    this.state = {
      step: 0,
      layout: this.computeLayoutData()
    };
    // setTimeout(() => {
    //   this.props.move(0,0,-15),
    //   this.setState({step:1})
    // }, 15000)
  }

  // builds a layoutData file
  computeLayoutData() {
    var layoutData = [];
    for (var i = 0; i < gamesetupData.length; i++){
      var obj = {};
      var pos = 0;
      obj.objects = {};
      obj.stepbase = gamesetupData[i].stepbase;
      obj.answer = gamesetupData[i].answer;
      for (var k = 0; k < gamesetupData[i].images.length; k++){
        var key = 'img_'+objectData[gamesetupData[i].images[k]].en;
        obj.objects[key] = {};
        obj.objects[key].type = 'box';
        obj.objects[key].coords = positionData[pos].coords;
        obj.objects[key].physicalWidth = positionData[pos].physicalWidth;
        obj.objects[key].physicalHeight = positionData[pos].physicalHeight;
        obj.objects[key].physicalDepth = positionData[pos].physicalDepth;
        obj.objects[key].color = positionData[pos].color;
        obj.objects[key].opacity = positionData[pos].opacity;
        obj.objects[key].selected = false;
        pos++;
      }
      for (var k = 0; k < gamesetupData[i].text.length; k++){
        var key = 'txt_'+objectData[gamesetupData[i].text[k]].en;
        obj.objects[key] = {};
        obj.objects[key].type = 'text';
        obj.objects[key].coords = positionData[pos].coords;
        obj.objects[key].height = positionData[pos].height;
        obj.objects[key].opacity = positionData[pos].opacity;
        obj.objects[key].rotateY = positionData[pos].rotateY;
        obj.objects[key].text = objectData[gamesetupData[i].text[k]].es;
        obj.objects[key].selected = false;
        pos++;
      }
      layoutData.push(obj);
    }
    // console.log(layoutData)
    return layoutData;
  }

  // controls selecting the item
  onEnter(id, step) {
    if (step === this.state.step){  // only deal with selection if on current step
      let cell = this.state.layout[step].objects[id];
      if (cell.selected){ // selected
        this.myInterval = setInterval(() => {
          this.setStateHelper(id, 'opacity', cell.opacity - 0.05, step)
          if (+(cell.opacity.toFixed(2)) === 0.5) { // rounding cause js addition isn't exact
            this.cellSelected(id, false, step)
          }
        }, 100);
      } else { // not selected
        this.myInterval = setInterval(() => {
          this.setStateHelper(id, 'opacity', cell.opacity + 0.05, step)
          if (+(cell.opacity.toFixed(2)) === 1) { // rounding cause js addition isn't exact
            this.cellSelected(id, true, step)
          }
        }, 100);
      }
      setTimeout(() => {
        clearInterval(this.myInterval)
      }, 1100)
    }
  }

  // controls canceling the in progress selection
  onExit(id, step) {
    if (step === this.state.step){  // only deal with selection if on current step
      let cell = this.state.layout[step].objects[id];
      clearInterval(this.myInterval)
      if (!cell.selected) {
        this.setStateHelper(id, 'opacity', 0.5, step)
      }
    }
  }

  // select the panel
  cellSelected(id, selected, step) {
    let cell = this.state.layout[step].objects[id];
    this.setStateHelper(id, 'selected', selected, step)
    if (cell.type === 'text'){
      if (selected){
        this.setStateHelper(id, 'color', constants.cellSelected, step)
      } else {
        this.setStateHelper(id, 'color', constants.white, step)
      }
    } else if (cell.type === 'image') {
      if (selected){
        this.setStateHelper(id, 'borderWidth', 0.05, step)
      } else {
        this.setStateHelper(id, 'borderWidth', 0.0, step)
      }
    } else if (cell.type === 'box') {
      if (selected){
        this.setStateHelper(id, 'color', constants.rsblue, step)
      } else {
        this.setStateHelper(id, 'color', constants.white, step)
      }
    }
    this.checkAnswer(step);
  }

  // check currently selected answers against expected answers
  checkAnswer(step){
    let correct = true;
    for (let i=0;i<this.state.layout[step].answer.length;i++){
      if (!this.state.layout[step].objects[this.state.layout[step].answer[i]].selected){
        correct = false;
      }
    }
    // TODO: NEED TO CHECK THAT EXTRA SELECTIONS ARE NOT MADE
    if (correct){
      this.moveToNextStep();
    }
  }

  // move camera to next step
  moveToNextStep() {
    var start = this.state.step * -15;
    this.setState({step:this.state.step+1});
    var moveTo = this.state.step * -15;
    for (var i = start;i >= moveTo;i--){
      var delay = (i*-1)*100;
      setTimeout(this.move, delay, i, this.props);
    }
  }

  // moves camera
  move(pos, props) {
    props.move(0,0,pos);
  }

  // helps find the correct panel in state and set the right attr:value
  setStateHelper(id, attr, value, step) {
    let cell = this.state.layout[step].objects[id];
    cell[attr] = value
    let obj = {}
    obj[id] = cell
    this.setState(obj)
  }

  // helper to attach event to each text component
  renderText(id, step) {
    return <TextPanel key={step+'-'+id} step={step} stepbase={this.state.layout[step].stepbase} panel={this.state.layout[step].objects[id]} id={id} panelEnter={this.onEnter.bind(this)} panelExit={this.onExit.bind(this)}/>
  }

  // helper to attach event to each image component
  renderImage(id, step) {
    return <ImagePanel key={step+'-'+id} step={step} stepbase={this.state.layout[step].stepbase} panel={this.state.layout[step].objects[id]} id={id} panelEnter={this.onEnter.bind(this)} panelExit={this.onExit.bind(this)}/>
  }

  // helper to render an animated box
  renderBox(id, step) {
    return <BaseBox key={step+'-'+id} step={step} stepbase={this.state.layout[step].stepbase} panel={this.state.layout[step].objects[id]} id={id} panelEnter={this.onEnter.bind(this)} panelExit={this.onExit.bind(this)}/>
  }

  // helper to render the floor
  renderFloor(step) {
    return <Cylinder
      key={step+'-floor'}
      radiusTop={7}
      radiusBottom={7}
      dimHeight={0.0}
      segments={50}
      style={{
        color: this.state.layout[step].stepbase.floorcolor,
        transform: [{translate: [this.state.layout[step].stepbase.coords.x, this.state.layout[step].stepbase.coords.y-2, this.state.layout[step].stepbase.coords.z]}, {rotateX: 0}],
      }}
    />
  }

  manualRender() {
    return (
      <View style={globalViewStyle}>
        {/* STEP 0 */}
        {this.renderText('run', 0)}
        {this.renderText('sleep', 0)}
        {this.renderText('speak', 0)}
        {this.renderText('swim', 0)}
        {this.renderText('cook', 0)}
        {this.renderImage('run', 0)}
        {this.renderBox('drink', 0)}
        {this.renderFloor(0)}
        {/* STEP 1 */}
        {this.renderText('run', 1)}
        {this.renderText('sleep', 1)}
        {this.renderText('speak', 1)}
        {this.renderText('swim', 1)}
        {this.renderText('cook', 1)}
        {this.renderImage('run', 1)}
        {this.renderBox('drink', 1)}
        {this.renderFloor(1)}
        {/* STEP 2 */}
        {this.renderText('run', 2)}
        {this.renderText('sleep', 2)}
        {this.renderText('speak', 2)}
        {this.renderText('swim', 2)}
        {this.renderText('cook', 2)}
        {this.renderImage('run', 2)}
        {this.renderBox('drink', 2)}
        {this.renderFloor(2)}
      </View>
    );
  }

  renderFromGameSetup() {
    var dom = [];
    for (var i = 0; i < this.state.layout.length; i++){
      for (var obj in this.state.layout[i].objects) {
        if (this.state.layout[i].objects[obj].type === 'text'){
          dom.push(this.renderText(obj, i));
        } else if (this.state.layout[i].objects[obj].type === 'box'){
          dom.push(this.renderBox(obj, i));
        }
      }
      dom.push(this.renderFloor(i));
    }
    return (
       <View style={globalViewStyle}>
        {dom}
       </View>
    );
  }

  render() {
    return this.renderFromGameSetup();
  }
};

export default World;
