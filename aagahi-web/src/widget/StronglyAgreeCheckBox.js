import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader, ClimbingBoxLoader, GridLoader, HashLoader } from 'react-spinners';
import { Label } from 'reactstrap';
import openIconic from "../img/open-iconic.svg";
import smileyLaugh from "../img/smiley-laugh.svg";
import smileyLaughSelected from "../img/smiley-laugh-selected.svg";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 0 auto;
    border-color: purple;
`;
 
class StronglyAgreeCheckBox extends React.Component {
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

    <div style={{verticalAlign:'bottom'}}>
      {/* <div style={{paddingRight:'1em', float: 'left'}}><label>Strongly Agree</label></div> */}
      <div class="pretty p-svg p-toggle p-plain p-bigger p-round" style={{fontSize: '1.5em', paddingRight:'1.5em'}}>
          <input type="radio" id={this.state.id} value={this.state.value} name={this.state.name} defaultChecked= { false} onChange={this.props.handleCheckboxChange}/>
          <div class="state p-off" >
            <img class="svg" style={{fill: "#65bbd2"}} src={smileyLaugh}/>
          </div>
          <div class="state p-on" >
            <img class="svg" style={{fill: "#65bbd2"}} src={smileyLaughSelected}/>  
          </div>
      </div>
    
    </div>

    // this component will be accessed in other components as below
    // <SmileAgreeCheckBox id="xyz" name="xyz" value="1" handleCheckboxChange={(e) => this.scoreChange(e, "xyz")}/>
    )
  }
}

export default StronglyAgreeCheckBox;