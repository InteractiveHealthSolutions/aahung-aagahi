import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import smileyCry from "../img/smiley-cry.svg";
import smileyCrySelected from "../img/smiley-cry-selected.svg";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class StronglyDisagreeCheckBox extends React.Component {
  constructor(props) {
    super(props);
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    this.state = {
      id: this.props.id,
      value: this.props.value,
      name: this.props.name
      // msg: this.props.msg
    }
  
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data });  

    this.state = {
        id: nextProps.id,
      value: nextProps.value,
      name: nextProps.name
    }
  }

  render() {

    return (

    <div style={{paddingRight:'1.5em'}}>
      <div class="pretty p-svg p-toggle p-plain p-bigger p-round" style={{fontSize: '1.5em', paddingRight:'1em'}}>
          <input type="radio" id={this.state.id} value={this.state.value} name={this.state.name} defaultChecked= { false} onChange={this.props.handleCheckboxChange}/>
          <div class="state p-off" >
            <img class="svg" style={{fill: "#65bbd2"}} src={smileyCry}/>
          </div>
          <div class="state p-on" >
            <img class="svg" style={{fill: "#65bbd2"}} src={smileyCrySelected}/>  
          </div>
      </div>
      {/* <label>Strongly Disagree</label> */}
    </div>

    // this component will be accessed in other components as below
    // <StronglyDisagreeCheckBox id="xyz" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    )
  }
}

export default StronglyDisagreeCheckBox;