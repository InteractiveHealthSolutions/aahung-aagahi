import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import smileyHappy from "../img/smiley-happy.svg";
import smileyHappySelected from "../img/smiley-happy-selected.svg";

class CustomRadioButton extends React.Component {
  constructor(props) {
    super(props);
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      id: this.props.id,
      value: this.props.value,
      name: this.props.name,
      labelText: this.props.labelText
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
        id: nextProps.id,
        value: nextProps.value,
        name: nextProps.name,
        labelText: nextProps.labelText
    }
  }

  render() {

    return (

      <div style={{width:'2em', display: "inline-block", verticalAlign: "top"}}>

        <div class="pretty p-svg p-toggle p-plain p-bigger p-round" > 
            <input type="radio" id={this.state.id} value={this.state.value} name={this.state.name} defaultChecked= { false} onChange={this.props.handleCheckboxChange}  ></input>
            <div class="state p-on" >
                <svg class="svg" viewBox="0 0 8 8" style={{fill: "rgb(247, 144, 29)"}}><use xlinkHref={`${openIconic}#circle-check`} class="icon-lock-unlocked"></use></svg>
                <label></label>
            </div>
            <div class="state p-off" >
                <svg class="svg" viewBox="0 0 8 8" style={{fill: "#522a71"}}><use xlinkHref={`${openIconic}#media-record`} class="icon-lock-locked"></use></svg>
                <label></label>
            </div>
          </div>
          <div style={{width: '5em', textAlign: 'center'}}>
            <label>{this.state.labelText}</label>
          </div>
      </div>

    )
  }
}

export default CustomRadioButton;